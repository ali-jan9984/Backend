import { Router } from "express";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import {addVideoToPlayList, createPlaylist, deletePlaylist, deleteVideoFromPlaylist, getPlaylistById, getUserPlaylist} from "../controllers/playlist.controller.js";

const router = Router();
// test successfully
router.route("/createPlaylist").post(verifyJWT,createPlaylist);
// test successfully
router.route('/getUserPlaylist').get(verifyJWT,getUserPlaylist);
// test equally
router.route('/:playlistId/getPlaylistById').get(verifyJWT,getPlaylistById);
// test successfully
router.route('/:playlistId/:videoId/addVideoToPlaylist').patch(verifyJWT,addVideoToPlayList);
// test successfully
router.route('/:playlistId/:videoId/deleteVideoFromPlaylist').delete(verifyJWT,deleteVideoFromPlaylist);
// not check
router.route('/:playlistId/deletePlaylist').delete(verifyJWT,deletePlaylist);

export {router}