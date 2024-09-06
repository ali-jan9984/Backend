import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Subscription} from "../models/Subscribtion.model.js";

const toggleSubscription = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;
    const {subscriptionId} = req.user._id;
    const subscription = await Subscription.findById(subscriptionId);
    if(!subscription){
        throw new ApiError(404,"subscriber not found")
    }
    const 
})

const userChannelSubscribers = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;
    const {subscriptionId} = req.body;
    const subscription = await Subscription.findById(subscriptionId);
    if(!subscription){
        throw new ApiError(404,"no subscriber available")
    }
})

const getSubscribedChannel = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;
    const {subscriptionId} = req.user._id;
    const subscription = await Subscription.findById(subscriptionId);
    if(!subscription){
        throw new ApiError(404,"no subscriber available")
    }
})

export {
    toggleSubscription,
    userChannelSubscribers,
    getSubscribedChannel,
}
