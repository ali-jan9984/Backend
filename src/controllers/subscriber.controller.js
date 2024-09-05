import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/Subscribtion.model.js";

const getAllSubscriber = asyncHandler(async(req,res)=>{
    const subcritpion = await Subscription.find({}).populate("user");
    if(!subcritpion){
        throw new ApiError(404,"no subscriber found")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,subcritpion,"subscriber fetched successfully")
    )
});

const addSubscriber = asyncHandler(async(req,res)=>{
    const {subscribedBy} = req.user._id;
    const existingSubscriber = await Subscription.findOne({subscribedBy});
    if(existingSubscriber){
        throw new ApiError(400,"email already exists")
    }
    const newSubscriber = new Subscription({subscribedBy});
    await newSubscriber.save();

    return res.status(200)
    .json(
        new ApiResponse(200,newSubscriber,"channel subscribe successfully")
    )
})
export {
    getAllSubscriber
    ,addSubscriber
}