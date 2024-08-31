import {Video} from "../models/Video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary} from '../utils/Cloudinary.js';

const getAllVideos = asyncHandler(async(req,res)=>{
    const {page=1,limit=10,sortBy="createdAt",sortType="desc",userId,query} = req.query;

    const filter = {};
    if(userId){
        filter.userId = userId;
        // it filters the user for the specific videos
    }
    if(query){
        filter.title = { $regex: query, $options: 'i'};
    }
    const videoQuery = Video.find(filter)
    .sort({ [sortBy]: sortType == 'desc' ? -1 : 1})
    .skip((page - 1) * limit)
    .limit(limit)

    const video = await videoQuery;

   return  res.json(video);
});
const publishVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            throw new ApiError(400, "Title is required");
        }

        // Check if files are uploaded correctly
        const thumbnailFile = req.files?.thumbnail?.[0]?.path;
        const videoFile = req.files?.video?.[0]?.path;

        if (!thumbnailFile) {
            throw new ApiError(400, "Thumbnail is required");
        }
        console.log(thumbnailFile);
        if (!videoFile) {
            throw new ApiError(400, "Video file is required");
        }

        // Upload files to cloud storage (e.g., Cloudinary)
        const thumbnail = await uploadOnCloudinary(thumbnailFile);
        if (!thumbnail) {
            throw new ApiError(400, "Thumbnail upload failed");
        }
        console.log(thumbnail);

        const video = await uploadOnCloudinary(videoFile);
        if (!video) {
            throw new ApiError(400, "Video upload failed");
        }
        console.log(video);
        // Create a new video entry in the database
        const newVideo = await Video.create({
            title,
            description,
            thumbnail: thumbnail.url,
            video: video.url,
            duration:video.duration,
        });
        // Respond with success
        return res.status(200).json(
            new ApiResponse(200, newVideo, "Video uploaded successfully")
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
});

const getVideoById = asyncHandler(
    async (req, res) =>{
        const {videoId} = req.params ;
        const video = await Video.findById(videoId);
        if (!video){
            throw new ApiError(400,"video is not available");
        }
        return res.status(200).json(new ApiResponse(200, video, "Video found successfully"));
    }
);

const updateVideoData = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    // Update only if fields are provided
    if (title) video.title = title;
    if (description) video.description = description;

    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video data updated successfully")
    );
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

const changeThumbnail = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const thumbnail = req.file?.thumbnail?.[0]?.path;
    const video = await Video.findById(videoId);
    if (!video){
        throw new ApiError(200,"video is not found")
    }
    if(thumbnail) video.thumbnail = thumbnail;
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

const togglePublisher = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"video not found")
    }
    video.ispublished = true,
    video.save();

    return res.status(200)
    .json(new ApiResponse(200,"video published successfully"))
});
export {
    publishVideo,
    getVideoById,
    videoViews,
    updateVideoData,
    changeThumbnail,
    deleteVideo,
    getAllVideos,
    togglePublisher
};
