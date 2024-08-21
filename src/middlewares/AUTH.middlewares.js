import {User} from '../models/User.model.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
// for verifying the jwt tokens with original tokens...
export const verifyJWT = asyncHandler(async(req,_,next)=>{
 try {
  // taking the access token from the cookies or from the authorization header...
   const token =   req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
   if (!token){
    throw new ApiError (401,"unauthorized Request");
   }
  //  decoding the token as it is encrypted and verifying it with token secret...
 const decodedInformation =   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 const user = await User.findById(decodedInformation?._id).select(
   "-password -refreshToken"
 );
 if(!user){
   throw new ApiError(401,"invalid access token")
 }
 req.user = user;
 next();
 } catch (error) {
  throw new ApiError(401,error?.message || "invalid access token");
 }
});