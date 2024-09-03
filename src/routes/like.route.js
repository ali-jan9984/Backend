import { Router } from "express";
import {verifyJWT} from "../middlewares/AUTH.middlewares.js"
import { likedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggleVideoLike").patch(verifyJWT,toggleVideoLike);
router.route("/toggleCommentLike").post(verifyJWT,toggleCommentLike);
router.route("/toggleTweetLike").post(verifyJWT,toggleTweetLike);
router.route("/getLikedVideos").get(verifyJWT,likedVideos);


export {
    router
}