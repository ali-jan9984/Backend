import { Router } from "express";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controller.js";

const router = Router();

// Route to get comments for a specific video
router.route("/:videoId/getComment").get(getVideoComment);

// Route to add a comment to a specific video
router.route("/:videoId/addComment").post(addComment);

// Route to update a specific comment
router.route("/comments/:commentId").patch(updateComment);

// Route to delete a specific comment
router.route("/comments/:commentId").delete(deleteComment);

export { router };
