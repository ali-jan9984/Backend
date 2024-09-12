import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Subscription} from "../models/Subscribtion.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    // Take the channelId from request.params
    const { channelId } = req.params;
    // Take the userId from req.user
    const userId = req.user._id;

    // Check if channelId is provided
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    // Find the subscription document by channelId
    const subscription = await Subscription.findOne({ channel: channelId });

    if (!subscription) {
        // If no subscription document exists for the channel, create one and add the subscriber
        const newSubscription = await Subscription.create({
            channel: channelId,
            subscribers: [userId]
        });
        return res.status(201).json(
            new ApiResponse(201, "Subscribed successfully", newSubscription)
        );
    }

    // Check if the user is already subscribed (exists in the subscribers array)
    const isSubscribed = Subscription.subscribers.includes(userId);

    if (isSubscribed) {
        // If the user is already subscribed, remove them from the subscribers array
        Subscription.subscribers.pull(userId);
        await Subscription.save();
        return res.status(200).json(
            new ApiResponse(200, "Subscription removed successfully", subscription)
        );
    } else {
        // If the user is not subscribed, add them to the subscribers array
        Subscription.subscribers.push(userId);
        await Subscription.save();
        return res.status(201).json(
            new ApiResponse(201, "Subscribed successfully", subscription)
        );
    }
});

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
    const { userId } = req.user._id;

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
