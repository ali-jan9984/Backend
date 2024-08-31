import {Playlist} from '../models/Playlist.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const getPlaylist = asyncHandler(async(req,res)=>{
    const {name,description} = req.body ;
    if(!name){
        throw new ApiError(400,"Playlist name is required")
    }
    Playlist.create({
        name,
        description
    });

    return res.status(200)
    .json(
        new ApiResponse(200,"playlist created successfully")
    )
});