import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Subscription} from "../models/Subscribtion.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;

    let subscription = await Subscription.findOne({ channelId: channelId });

    // If no subscription exists, create one
    if (!subscription) {
        subscription = await Subscription.create({
            channelId: channelId,
            subscriber: [userId],
        });
        return res.status(201).json(
            new ApiResponse(201, "Subscribed successfully", subscription)
        );
    }

    // Check if the user is already subscribed
    const isSubscribed = subscription.subscriber.includes(userId);

    if (isSubscribed) {
        // If the user is already subscribed, remove them from the subscribers array
        subscription.subscriber.pull(userId);
        await subscription.save();
        return res.status(200).json(
            new ApiResponse(200, "Subscription removed successfully", subscription)
        );
    } else {
        // If the user is not subscribed, add them to the subscribers array
        subscription.subscriber.push(userId);
        await subscription.save();
        return res.status(201).json(
            new ApiResponse(201, "Subscribed successfully", subscription)
        );
    }
});

const getSubscriber = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    const subscription = await Subscription.findOne({channelId})
        .populate('subscribers', 'username email');

    if (!subscription) {
        throw new ApiError(404, "Subscriber not found");
    }

    const subscriber = subscription.subscriber.map(sub =>{
        return {
            _id: sub._id,
            userName: sub.userName,
            email: sub.email
        }
    });

    if (!subscriber) {
        throw new ApiError(404, "Subscriber not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Subscriber fetched successfully", subscriber)
    );
});

const getSubscribedChannel = asyncHandler(async(req,res)=>{
    const { userId } = req.user._id;

    const subscribedChannels = await Subscription.find({ subscriber: userId })
        .populate('channel', 'username');
    if(!subscribedChannels){
        throw new ApiError(400,'no following found')
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
    getSubscriber,
    getSubscribedChannel,
}
