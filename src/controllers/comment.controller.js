import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Comment} from "../models/Comments.model.js"
import { Video } from "../models/Video.model.js";

// Get comments for a specific video with pagination
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const totalComments = await Comment.countDocuments({ videoId });
    const totalPages = Math.ceil(totalComments / limit);
    
    const comments = await Comment.find({ videoId })
        .populate("videoId", "title") // Adjust fields as needed
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    if (!comments.length) {
        throw new ApiError(404, "No comments found for this video");
    }

    return res.status(200).json(new ApiResponse(200,comments, totalComments, totalPages));
});

// Add a new comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new ApiError(404, "Video not found");
    }

    const newComment = await Comment.create({ content, videoId });
    return res.status(201).json(new ApiResponse(newComment));
});

// Update an existing comment
const updateComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(new ApiResponse(comment, 1, "Comment updated successfully"));
});

// Delete a comment by ID
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    await comment.remove();
    return res.status(200).json(new ApiResponse(null, 1, "Comment deleted successfully"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
};

// test successfully
