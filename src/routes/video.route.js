import {upload} from '../middlewares/Multer.middleware.js';
// import { changeThumbnail, deleteVideo, getAllVideos, getVideoById, publishVideo,togglePublisher,updateVideoData,videoViews} from "../controllers/video.controllers.js";
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
);

// secure routes
// test successfully
router.route('/videos').get(getAllVideos);
// test successfully
router.route('/:videoId').get(getVideoById);
// test successfully
router.route("/:videoId/updateData").patch(updateVideoData);
// test successfully
router.route("/:videoId/thumbnail").patch(changeThumbnail);
// equal success
router.route("/:video/deleteVideo").delete(deleteVideo);
// test successfully
router.route("/:videoId/views").get(videoViews);
// test successfully
router.route("/:videoId/ispublished").patch(togglePublisher);

export {router};
