import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Subscription} from "../models/Subscribtion.model.js";

const toggleSubscription = asyncHandler(async(req,res)=>{
    // take the id from request.params
    const { channelId } = req.params;
    // take the id form the req.user
    const userId = req.user._id;
// condition on the 
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }
    // check whether the subscription is exisit or not
    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });
// if the subscription exits it will remove from the database
    if (existingSubscription) {
        // If subscription exists, remove it
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(
            new ApiResponse(200, "Subscription removed successfully", null)
        );
        // if the subscription doesnot exits it will be made
    } else {
        // If subscription doesn't exist, create it
        const newSubscription = await Subscription.create({
            subscriber: userId,
            channel: channelId
        });
        return res.status(201).json(
            new ApiResponse(201, "Subscribed successfully", newSubscription)
        );
    }
})

const userChannelSubscribers = asyncHandler(async(req,res)=>{
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    const subscribers = await Subscription.find({ channelId })
    .populate('userId', 'username email');

    if (!subscribers || subscribers.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, "No subscribers found for this channel", [])
        );
    }

    const subscriberList = subscribers.map(sub => ({
        _id: sub.userId._id,
        username: sub.userId.username,
        email: sub.userId.email
    }));

    return res.status(200).json(
        new ApiResponse(200, "Subscribers fetched successfully", subscriberList)
    );
})

const getSubscribedChannel = asyncHandler(async(req,res)=>{
    // ...
    const { userId } = req.user;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const subscribedChannels = await Subscription.find({ subscriber: userId })
        .populate('channel', 'username');

    if (!subscribedChannels || subscribedChannels.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, "User is not subscribed to any channels", [])
        );
    }

    const channelList = subscribedChannels.map(sub => ({
        _id: sub.channel._id,
        username: sub.channel.username
    }));

    return res.status(200).json(
        new ApiResponse(200, "Subscribed channels fetched successfully", {
            count: channelList.length,
            channels: channelList
        })
    );
})

export {
    toggleSubscription,
    userChannelSubscribers,
    getSubscribedChannel,
}
