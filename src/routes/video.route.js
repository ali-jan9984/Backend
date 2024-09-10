import { upload } from '../middlewares/Multer.middleware.js';
import { 
    changeThumbnail, 
    ChangeVideoData, 
    deleteVideo, 
    getAllVideos,
    videoUpload, 
    videoViews 
} from "../controllers/video.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/uploadVideo").post(
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    videoUpload
);

// Secure routes
router.route('/videos').get(getAllVideos);
router.route("/:videoId/changeVideoData").patch(ChangeVideoData);
router.route("/:videoId/thumbnail").patch(changeThumbnail);
router.route("/:videoId/deleteVideo").delete(deleteVideo);
router.route("/:videoId/views").get(videoViews);

export { router };

