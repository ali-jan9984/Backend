import { Router } from "express";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import {createPlaylist} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/createPlaylist").post(verifyJWT,createPlaylist);

export {router};