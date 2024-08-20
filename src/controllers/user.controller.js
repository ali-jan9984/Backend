import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
       const user = await User.findById(userId);
       const AccessToken = user.generateAccessToken();
       const RefreshToken = user.generateRefreshToken();

       user.RefreshToken = RefreshToken;
       user.save({validateBeforeSave:false});

       return {RefreshToken,AccessToken};

    } catch (error) {
        throw new ApiError(500,"Something went Wrong while generating Refresh and Access Token");
    };
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, userName, password } = req.body;
    // Validation for required fields
    if ([fullName, email, userName, password].some((field) => field === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Email validation
    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email");
    }

    // Password validation
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /\d/;
    const lowercaseLetterRegex = /[a-z]/;
    const uppercaseLetterRegex = /[A-Z]/;

    if (
        !specialCharacterRegex.test(password) ||
        !numberRegex.test(password) ||
        !lowercaseLetterRegex.test(password) ||
        !uppercaseLetterRegex.test(password)
    ) {
        throw new ApiError(400, "Password must include at least one special character, one number, one lowercase letter, and one uppercase letter.");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new ApiError(400, "User already exists");
    }

    // Handling avatar and cover image files
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    console.log(req.files)

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImageLocalPath) && req.files.coverImage.length> 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Uploading files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar || !avatar.url) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // Create user in the database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        userName:userName.toLowerCase(),
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler( async (req,res) =>{
    // to take data from req.body
    // is username and email availabe
    // find the user
    // password check 
    // if password check we have to use the access and refresh token
    // send access and refresh token in cookies

    const {email,userName,password} = req.body;
    
    if (!email){
        throw new ApiError(400,"userName or email is required");
    };

  const user = await User.findOne({
        $or:[{userName},{email}]
    });

    if (!user){
        throw new ApiError(404,"User is not Register");
    };

   const isPasswordValid =  await user.isPasswordCorrect(password);
   if (!isPasswordValid){
    throw new ApiError(401,"Invalid Password");
   }
 const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

 const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
 )
 const options = {
    httpOnly:true,
    secure:true
 }
 return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
 .json(
    new ApiResponse(200,{
        user:loginUser,refreshToken,accessToken
    },
    "User Logged in Successfully"
)
 )
});

const logoutUser = asyncHandler(async(req,res)=>{
    // remove the access token from cookies
    // remove the refresh token from database
    // send the response to the user
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },{
            new:true
        }
    )
    const options ={
        httpOnly:true,
        secure:true,
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshCookie",options)
    .json(new ApiResponse(200,"User logout Successfully"));
});

export { registerUser , loginUser ,logoutUser};
