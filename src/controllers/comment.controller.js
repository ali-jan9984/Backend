import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/Comments.model.js"
import {Video} from "../models/Video.model.js";

const getVideoComment = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const video = await Video.findById(id).populate("comment");
    if (!video){
        throw new ApiError(400,"Video not found")
    }
    return res.json(video.comment);
});

const addComment = asyncHandler(async(req,res)=>{
    // add a comment to a video 
    const {id} = req.params;
    const {content} = req.body;
    const video = await Video.findById(id);
    if (!video){
        throw new ApiError(400,"Video not found")
    }
    const newComment = new Comment({content});
    await newComment.save();

    return res.status(200)
    .json(
        new ApiResponse(200,"comment save successfully")
    )
});

const updateComment = asyncHandler(async(req,res)=>{
    // update a comment
    const {commentId} = req.params;
    const {content} = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment){
        throw new ApiError(400,"comment not found");
    }
    comment.content = content;
    Comment.save();

    return res.status(200)
    .json(
        new ApiResponse(200,"comment update successfully")
    )  
});

const deleteComment = asyncHandler(async(req,res)=>{
    // delete a comment
    const {commentId} = req.params;
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400,"comment is not found");
    }
    comment.remove;
    return res.status(200)
    .json(
        new ApiResponse(200,"comment remove successfully")
    )
});

export {
    getVideoComment,
    addComment,
    updateComment,
    deleteComment,
}
