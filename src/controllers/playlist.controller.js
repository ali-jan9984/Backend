import { Playlist } from '../models/Playlist.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Video } from '../models/Video.model.js';

// Create a new playlist
const createPlaylist = asyncHandler(async(req,res)=>{
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
        throw new ApiError(400, "Playlist name is required");
    }

    try {
        const newPlaylist = await Playlist.create({
            name,
            description,
            owner: userId,
            videos: []
        });

        return res.status(201).json(
            new ApiResponse(201, "Playlist created successfully", newPlaylist)
        );
    } catch (error) {
        throw new ApiError(500, "Error creating playlist", error);
    }
});

const getUserPlaylist = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    try {
        const userPlaylists = await Playlist.find({ owner: userId })
            .select('name description videos')
            .populate('videos', 'title thumbnail');

        if (!userPlaylists || userPlaylists.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, "No playlists found for this user", [])
            );
        }

        return res.status(200).json(
            new ApiResponse(200, "User playlists fetched successfully", userPlaylists)
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching user playlists", error);
    }
    
});

const getPlaylistById = asyncHandler(async(req,res)=>{
    const playlistId = req.params.id;
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }
    return res.json(playlist);
});

const addVideoToPlayList = asyncHandler(async(req,res)=>{
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist ID and Video ID are required");
    }

    try {
        // Find the playlist and ensure it belongs to the user
        const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

        if (!playlist) {
            throw new ApiError(404, "Playlist not found or you don't have permission to modify it");
        }

        // Check if the video exists
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        // Check if the video is already in the playlist
        if (playlist.videos.includes(videoId)) {
            return res.status(200).json(
                new ApiResponse(200, "Video is already in the playlist", playlist)
            );
        }

        // Add the video to the playlist
        playlist.videos.push(videoId);
        await playlist.save();

        return res.status(200).json(
            new ApiResponse(200, "Video added to playlist successfully", playlist)
        );
    } catch (error) {
        throw new ApiError(500, "Error adding video to playlist", error);
    }
})
// Delete a video from playlist by ID
const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist ID and Video ID are required");
    }

    try {
        // Find the playlist and ensure it belongs to the user
        const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

        if (!playlist) {
            throw new ApiError(404, "Playlist not found or you don't have permission to modify it");
        }

        // Check if the video is in the playlist
        const videoIndex = playlist.videos.indexOf(videoId);
        if (videoIndex === -1) {
            return res.status(200).json(
                new ApiResponse(200, "Video is not in the playlist", playlist)
            );
        }

        // Remove the video from the playlist
        playlist.videos.splice(videoIndex, 1);
        await playlist.save();

        return res.status(200).json(
            new ApiResponse(200, "Video removed from playlist successfully", playlist)
        );
    } catch (error) {
        throw new ApiError(500, "Error removing video from playlist", error);
    }
});

// Delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user._id;

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }
        const playlist = await Playlist.findOneAndDelete({id:playlistId,owner:userId});
        if(!playlist){
            throw new ApiError(400,'playlist is not found')
        }
        return res.status(200)
        .json(
            new ApiResponse(200,'playlist delete successfully')
        )
});

// Update a playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    if (!name && !description) {
        throw new ApiError(400, "At least one field (name or description) is required for update");
    }

    try {
        const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

        if (!playlist) {
            throw new ApiError(404, "Playlist not found or you don't have permission to modify it");
        }

        if (name) playlist.name = name;
        if (description) playlist.description = description;

        const updatedPlaylist = await playlist.save();

        return res.status(200).json(
            new ApiResponse(200, "Playlist updated successfully", updatedPlaylist)
        );
    } catch (error) {
        throw new ApiError(500, "Error updating playlist", error);
    }
});


export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlayList,
    deleteVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
