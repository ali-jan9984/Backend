import { Router } from "express";
import { loginUser, logoutUser, registerUser, updateAvatarImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/Multer.middleware.js";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();
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
router.route("/login").post(loginUser);
// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export {router};