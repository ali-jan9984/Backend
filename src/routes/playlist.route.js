import { Router } from "express";
import { deletePlaylist} from "../controllers/playlist.controller.js";

const router = Router();

router.route('deletePlaylist').delete(deletePlaylist);

export {router};