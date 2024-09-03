import { Playlist } from '../models/Playlist.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create a new playlist
const createPlaylist = asyncHandler(async(req,res)=>{
    const {name,description} = req.body;
    const playlist = await Playlist.create({name,description});
    res.json(playlist);
});

const getUserPlaylist = asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const playlists = await Playlist.find({user:userId});
    res.json(playlists);
});

const getPlaylistById = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const playlist = await Playlist.findById(id);
    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }
    return res.json(playlist);
});

const addVideoToPlayList = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params;
    const {videoId} = req.body;
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }
})
// Delete a playlist by ID
const deletePlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedPlaylist = await Playlist.findByIdAndDelete(id);

    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Playlist deleted successfully")
    );
});

export {
    deletePlaylist,
};
