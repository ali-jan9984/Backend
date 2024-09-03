import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router();

// Route to get comments for a specific video
// test
router.route("/:videoId/getVideoComment").get(getVideoComments);

// Route to add a comment to a specific video
router.route("/:videoId/addComment").post(addComment);

// Route to update a specific comment
router.route("/:commentId").patch(updateComment);

// Route to delete a specific comment
router.route("/:commentId/deleteComment").delete(deleteComment);

export { router };
