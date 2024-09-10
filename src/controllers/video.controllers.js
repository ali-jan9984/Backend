import { Video } from "../models/Video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary} from '../utils/Cloudinary.js';
import fs from 'fs';

const getAllVideos = asyncHandler (async(req,res)=>{
    try {
        const videos = await Video.find({ isPublished: true })
            .select('title description thumbnail video views duration createdAt')
            .sort({ createdAt: -1 });

        if (!videos || videos.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, "No videos found", [])
            );
        }

        return res.status(200).json(
            new ApiResponse(200, "Videos fetched successfully", videos)
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching videos", error);
    }

})

const videoUpload = asyncHandler(async (req, res) => {

    // first we take the title and title is required 
    // second description is not required
    // owner of the vidoe is required
    // isPublished is a type of button which say that it is publish or not 
    // now we take the video from and also generate the duration for it
    // now take the thumbnail for the video
try {    
        const { title, description, isPublished } = req.body;
        if (!title) {
            throw new ApiError(400, "Title is required");
        }
        const thumbnailFile =req.file?.thumbnail?.[0].path;
        const videoFile = req.file?.video?.[0]?.path;

        console.log(thumbnail,videoFile);
    
        if (!thumbnailFile) {
            throw new ApiError(400, "Thumbnail is required");
        }

        if (!videoFile) {
            throw new ApiError(400, "Video file is required");
        }
    
        const thumbnail = await uploadOnCloudinary(thumbnailFile);
        if (!thumbnail) {
            throw new ApiError(400, "Thumbnail upload failed");
        }
    
        const video = await uploadOnCloudinary(videoFile);
        if (!video) {
            throw new ApiError(400, "Video upload failed");
        }
    
        const newVideo = await Video.create({
            title,
            description,
            isPublished,
            thumbnail: thumbnail.url,
            video: video.url,
        });
    
        // Clean up files after upload
        fs.unlinkSync(thumbnailFile);
        fs.unlinkSync(videoFile);

        return res.status(200).json(
            new ApiResponse(200, newVideo, "Video uploaded successfully")
        );
} catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
}
});

const videoViews = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const video = await Video.findById(videoId);

    video.views += 1;
    await video.save();
    
    return res.status(200).json(
        new ApiResponse(200, video, "Video views updated successfully")
    );
});

const ChangeVideoData = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const {title,description,} = req.body;
    const video = await Video.findById(videoId);
    if (!video){
        throw new ApiError(400,"video not found")
    }
    video.title = title;
    video.description = description;
    await video.save();

    return res.status(200)
    .json(
        new ApiResponse(200,video,"Video data updated successfully")
    )
});

const changeThumbnail = asyncHandler(async(req,res)=>{
    const videoId = req.params;
    const {thumbnail} = req.file?.thumbnail?.path;
    const video = await Video.findById(videoId);
    if (!video){
        throw new ApiError(200,"video is not found")
    }
    video.thumbnail = thumbnail;
    await video.save();
    return res.status(200)
    .json(
        new ApiResponse(200,video,"thumbnail updated successfully")
    )
});

const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const video = await Video.findById(videoId);
    if (!video){
        throw new ApiError(400,"video not found for deletion")
    }
    await video.remove();
    return res.status(200)
    .json(
        new ApiResponse(200,"video removed successfully")
    )
});
export {
    getAllVideos,
    videoUpload,
    videoViews,
    ChangeVideoData,
    changeThumbnail,
    deleteVideo,
};
