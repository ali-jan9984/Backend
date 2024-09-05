import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Like} from '../models/Likes.model.js';
import { Video } from "../models/Video.model.js";
import {Tweet} from "../models/Tweets.model.js";
import {Comment} from "../models/Comments.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const likeBy = req.user._id; // Corrected this line

    // Find the video by ID
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if the user already liked the video
    const existingLike = await Like.findOne({ videoId, likeBy });
    let message;

    if (existingLike) {
        // If like exists, remove it (unlike)
        await Like.deleteOne({ _id: existingLike._id });
        message = "Like removed successfully";
    } else {
        // If like does not exist, add it
        const newLike = new Like({ videoId, likeBy });
        await newLike.save();
        message = "Like added successfully";
    }

    return res.status(200).json(
        new ApiResponse(200, message)
    );
});

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const likeBy = req.user._id;
    const comment = await Comment.findById(commentId);
    console.log(comment);
    if(!comment){
        throw new ApiError(400,"comment not found for like")
    }
    const existingLike = await Like.findOne({commentId,likeBy});
    let message;
    if(existingLike){
        await Like.deleteOne({_id:existingLike._id});
        message = "Like remove successfully"
    }else{
        const newLike = new Like({commentId,likeBy});
        await newLike.save();
        message = "Like added successfully"
    }
    return res.status(200)
    .json(
        new ApiResponse(200,"like toggled successfully")
    )
});

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;
    const likeBy = req.user._id;
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(400,"tweet not found for like")
    }
    const existingLike = await Like.findOne({tweetId,likeBy});
    let message;
    if(existingLike){
       await Like.deleteOne({_id:existingLike._id})
       message = "like removed successfully" 
    }
    else{
        const newLike = new Like({tweetId,likeBy})
        await newLike.save();
        message = "like added successfully"
    }
    return res.status(200)
    .json(
        new ApiResponse(200,"like toggled successfully")
    )
});

const likedVideos = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Find likes associated with the user and populate the associated videos
    const likes = await Like.find({ userId }).populate("video"); // Assuming 'videoId' is the field to populate

    // Check if likes array is empty
    if (likes.length === 0) {
        throw new ApiError(404, "No likes found for this user");
    }

    return res.status(200).json(
        new ApiResponse(200, "Likes retrieved successfully", likes)
    );
});

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    likedVideos
}