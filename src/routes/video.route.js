import {upload} from '../middlewares/Multer.middleware.js';
import { changeThumbnail, deleteVideo, getAllVideos, getVideoById, publishVideo,updateVideoData,videoViews} from "../controllers/video.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/publish-video").post(
    upload.fields(
        [
            {
                name:"video",
                maxCount:1
            },
            {
                name:"thumbnail",
                maxCount:1,
            }
        ]
    ),publishVideo
)

// secure routes
// test successfully
router.route('/videos').get(getAllVideos);
// test successfully
router.route('/video/:videoId').get(getVideoById);
router.route("/video/:videoId/updateData").patch(updateVideoData);
router.route("/video/:videoId/views").get(videoViews);
router.route("video/:videoId/thumbnail").patch(changeThumbnail);
router.route("/video/:video/deleteVideo").delete(deleteVideo);

export {router};
