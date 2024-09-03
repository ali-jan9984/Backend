import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Like} from '../models/Likes.model.js';
import { Video } from "../models/Video.model.js";
import {Tweet} from "../models/Tweets.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { userId } = req.user;

    // Find the video by ID
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if the user already liked the video
    const existingLike = await Like.findOne({ videoId, userId });
    let message;

    if (existingLike) {
        // If like exists, remove it (unlike)
        await Like.deleteOne({ _id: existingLike._id });
        message = "Like removed successfully";
    } else {
        // If like does not exist, add it
        const newLike = new Like({ videoId, userId });
        await newLike.save();
        message = "Like added successfully";
    }

    return res.status(200).json(
        new ApiResponse(200, message)
    );
});
const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const {userId} = req.user;
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400,"comment not found for like")
    }
    const like = await Like.findOne({commentId,userId});
    if(!like){
        throw new ApiError(400,"like not found on comment")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,"like toggled successfully")
    )
});

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;
    const {userId} = req.user;
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(400,"tweet not found for like")
    }
    const like = await Like.findOne({tweetId,userId});
    if(!like){
        throw new ApiError(400,"like not found on comment")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,"like toggled successfully")
    )
});

const likedVideos = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Find likes associated with the user and populate the associated videos
    const likes = await Like.find({ userId }).populate("videoId"); // Assuming 'videoId' is the field to populate

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