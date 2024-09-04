import { Router } from "express";
import {verifyJWT} from "../middlewares/AUTH.middlewares.js"
import { likedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();
// test successfully
router.route("/:videoId/toggleVideoLike").patch(verifyJWT,toggleVideoLike);
// test successfully
router.route("/:commentId/toggleCommentLike").patch(verifyJWT,toggleCommentLike);
router.route("/:tweetId/toggleTweetLike").patch(verifyJWT,toggleTweetLike);
router.route("/getLikedVideos").get(verifyJWT,likedVideos);

export {
    router
}