import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/User.model.js';
import {uploadOnCloudinary} from '../utils/Cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser =  asyncHandler( async (req,res)=>{

    // get user details from frontend but there is no frontend so it is supplied by the postman
    // validation means that the email is true or the password is required , not empty also etc
    // check if user already exist in the database or not, we check it by the uqique email or username
    // check for images, and also check for avatar
    // if the pictures are available so to upload them on cloudinary and also on cloudinary check for avatar
    // create user object - create entry in db
    // remove password and refresh token from response 
    // check for user creation if user is create so return response otherwies send an error

    const {fullName,email,userName,password} = req.body;
    // console.log(req.body);
    console.log("email",email,"fullName",fullName,"userName",userName,"password",password);
    // for validation in all inputs
    if(
        [fullName,email,userName,password].some((field)=>field === "")
    ){
        throw new ApiError(400,"all fields are required")
    }
    // for email validation
    if (!email.includes("@")){
        throw new ApiError(400,"invalid email");
    }
    // password validation
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
    // password must required eight characters
    if (password.length < 8){
        throw new ApiError(400,"password must be at least 8 characters Long");
    }
  
    //  to find a user
  const existedUser =   User.findOne({
        $or:[{userName},{email}]
    });
    // console.log(existedUser);
    if (existedUser){
        throw new ApiError(400,"user already exist");
    }
    // for avatar image and coverimage
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }
    // uploading on the cloudinary
 const avatar =  await uploadOnCloudinary(avatarLocalPath);
 const coverImage = await uploadOnCloudinary(coverImageLocalPath);
 if (!avatar){
    throw new ApiError(400,"Avatar is required")
 }
//  now to create user in database
const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    userName:userName.toLowerCase(),
    password
})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
);

if (!createdUser){
    throw new ApiError(500,'something went wrong while registration user');
}
return res.status(201).json(
    new ApiResponse(200, createdUser,"user registered successfully")
)
});

export {registerUser};