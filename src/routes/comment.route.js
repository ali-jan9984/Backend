import { Router } from "express";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controller.js";

const router = Router();

router.route("/getVideoComment").get(getVideoComment);
router.route("/addComment").post(addComment);
router.route("/updateComment").patch(updateComment);
router.route("deleteComment").delete(deleteComment);

export {router};