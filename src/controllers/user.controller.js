import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// generating access and refreshToken...
const generateAccessAndRefreshTokens = async (_id)=>{
    try {
       const user = await User.findById(_id);
       const RefreshToken = user.generateRefreshToken();
       const AccessToken = user.generateAccessToken();
       user.RefreshToken = RefreshToken;
    //    user.save method save the given field in the database...
    // validateBeforeSave is used for not refreshing the other fields...
       user.save({validateBeforeSave:false});
       return {RefreshToken,AccessToken};
    } catch (error) {
        throw new ApiError(500,
            "Something went Wrong while generating Refresh and Access Token"
        );
    };
}
// registering the user in mongodb atlas...
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, userName, password } = req.body;
    // Validation for required fields
    if (
        [fullName, email, userName, password]
        .some((field) => field === "")
    )
    {
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
        throw new ApiError(400, 
            "Password must include at least one special character, one number, one lowercase letter, and one uppercase letter."
        );
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
    let coverImageLocalPath;
    if (req.files && 
    Array.isArray(req.files.coverImageLocalPath) && 
    req.files.coverImage.length> 0)
    {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Uploading files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!(avatar || avatar.url)) {
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
    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});
// loginning the user after registration...
const loginUser = asyncHandler(async (req, res) => {
    const { email,userName, password } = req.body;  
    // if (!(email || userName)) {
    //     throw new ApiError(400, "Username or email is required");
    // };
    if (!email){
        throw new ApiError(400, "Email is required");
    }
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User is not registered");
    };

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Password is Invalid");
    }

    const { RefreshToken, AccessToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", AccessToken, options)
        .cookie("refreshToken", RefreshToken, options)
        .json(new ApiResponse
            (200, {
                user: loggedInUser,
                refreshToken: RefreshToken,
                accessToken: AccessToken
            },
             "User logged in successfully")
        );
});
// Logout the user if the user is login only...
const logoutUser = asyncHandler(async(req,res)=>{
    // remove the access token from cookies
    // remove the refresh token from database
    // send the response to the user
    // we are using here the middleware which is use for condition for checking the user is login by refresh and access token

   await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
                // this remove the field from the document
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
    .json(new ApiResponse
        (200,"User logout Successfully")
    );
});
// refreshing the access and refresh token by cookies...
const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
   if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized Request");
   }
  try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN,);
  
  const user =  await User.findById(decodedToken?._id);
//   console.log(user);
  if(!user){
      throw new ApiError(401,"Invalid Refresh Token");
  }
  
  if (incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh token is expired or use")
  }
  
  const options = {
      httpOnly:true,
      secure:true,
  }
  const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id);
  
  return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",newrefreshToken,options)
.json(new ApiResponse
    (200,
          {accessToken,refreshToken:newrefreshToken},
          "Access Token Refreshed"
      )
  )
  } catch (error) {
    throw new ApiError(401,error?.message || "invalid Refresh Token")
  }  
});
// changing password after user register...
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword} = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!(newPassword === confirmPassword)){
        throw new ApiError(400,"Password does not match");
    }
    if (!isPasswordCorrect){
        throw new ApiError(401,"invalid oldPassword");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new ApiResponse(200,"Password changed successfully"))
});
const getCurrentUser = asyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"currentUser fetch successfully"));
});
// updating account details but not the images after user login...
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, userName, email } = req.body;

    // Validate required fields
    if (!email || !userName) {
        throw new ApiError(400, "Please fill all fields");
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { fullName, userName, email },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        throw new ApiError(400, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Account details updated successfully")
    );
});

// updating the user avatar image after logging...
const updateAvatarImage = asyncHandler(async(req,res)=>{
   const avatarLocalPath = req.file?.path
    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url){
        throw new ApiError(400,"Avatar upload failed");
    }
    const user = await User.findByIdAndUpdate(req.user?.id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            new:true
        }
    ).select("-password");
    await user.save({validateBeforeSave:false});
    return res.status(200)
    .json(new ApiResponse(200,user,"Avatar is Uploaded Successfully"));
});
// updating the coverImage after logging the user...
const updateCoverImage = asyncHandler(async (req,res)=>{
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath){
        throw new ApiError(400,"Cover Image file is missing");
    }
    const coverImage = uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url){
        throw new ApiError(400,"Cover Image upload failed");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {
            new:true
        }
    ).select("-password");
    return res.status(200)
    .json(new ApiResponse(200,user,"user coverImage update successfully"));
});

const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {userName} = req.params;
    if (!userName?.trim()){
        throw new ApiError(400,"userName is missing");
    }
   const channel = await User.aggregate([{
    $match:{
        userName:userName
    }
   },
   {$Lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscriber"
    }
   },
   {$lookup:{
    from:"subscriptions",
    localField:"_id",
    foreignField:"subscriber",
    as:"subscribedTo"
   }},
   {$addFields:{
    "subscriptionsCount":{$size:"$subscriber"},
    "subscribedToCount":{$size:"$subscribedTo"},
    isSubscribed:{
        $cond:{
            if:{
                $in:[req.user?._id,"$subcriber.subscribe"],
                then:true,
                else:false
            }
        }
    }
}
   },
   {
    $project:{
        fullName:1,
        userName:1,
        subscriptionsCount:1,
        subscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1,        
    }
   }
]);
if (!channel?.length){
    throw new ApiError(404,"Channel not found");
}
return res.status(200).json(new ApiResponse(200,channel[0],"channel fetched successfully"))
});

const getUserWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate(
        [
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(req.user?._id)
                }
            },{
                $lookup:{
                    from:"videos",
                    localField:"watchHistory",
                    foreignField:"_id",
                    as:"watchHistory",
                    pipeline:[
                        {
                            $lookup:{
                                from:"users",
                                localField:"owner",
                                foreignField:"_id",
                                as:"owner",
                                pipeline:[
                                    {
                                        $project:{
                                            fullName:1,
                                            userName:1,
                                            avatar:1,
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                owner:{$arrayElemAt:["$owner",0]}
                            }
                        }
                    ]
                }
            }
        ]
    );
    if (!user?.length) {
        throw new ApiError(404, "UserWatch History is not found");
    }
    return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"watch history fetched successfully"))
})
export { 
    registerUser 
    , loginUser 
    , logoutUser 
    , refreshAccessToken
    , getCurrentUser
    , changeCurrentPassword
    , updateAccountDetails
    , updateAvatarImage
    , updateCoverImage
    , getUserChannelProfile
    , getUserWatchHistory
 };
