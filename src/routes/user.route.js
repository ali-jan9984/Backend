import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, updateAvatarImage, updateCoverImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/Multer.middleware.js";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();
// test successfully
router.route("/register").post(
    upload.fields(
        [
            {
                name:"avatar",
                maxCount:1
            },
            {
                name:"coverImage",
                maxCount:1,
            }
    ]),
    registerUser
);
// test successfully
router.route("/login").post(loginUser);
// secured routes
// test successfully
router.route("/logout").post(verifyJWT, logoutUser);
// test successfully few doubts
router.route("/refresh-token").post(refreshAccessToken);
// test successfully
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
// test successfully
router.route("/current-user").get(verifyJWT,getCurrentUser);
// test successfully
router.route("/update-account-details").patch(verifyJWT,updateAccountDetails);

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatarImage);
// test successfully
router.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage"),updateCoverImage);
router.route("/channel/:userName").get(verifyJWT,getUserChannelProfile);
// test successfully
router.route("/watch-history").get(verifyJWT,getUserWatchHistory);

export {router};