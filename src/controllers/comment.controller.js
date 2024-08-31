import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/Comments.model.js";
import {Video} from "../models/Video.model.js";

const getVideoComment = asyncHandler(async(req,res)=>{
    const {Id} = req.params;
    // assuming 'videoId' is stored in the "comment" model to relate comments to a video
    const comments = await Comment.findById({videoId:Id});
    if (!comments.length){
        throw new ApiError(400,"No comment found for this video");
    }
    return res.json(comments);
});

const addComment = asyncHandler(async(req,res)=>{
    // add a comment to a video 
    const {id} = req.params;
    // this is the id of video
    const {content} = req.body;
    // ensure the video exists or not
    const video = await Video.findById(id);
    if (!video){
        throw new ApiError(400,"Video not found")
    }
    // create and save the comment
    const newComment = new Comment({content,videoId:id});
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
    await comment.save();

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
