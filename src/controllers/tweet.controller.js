import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/Tweets.model.js";
import { User } from "../models/User.model.js";

const getTweets = asyncHandler(async(req,res)=>{
    const tweets = await Tweet.find()
    if(!tweets){
        throw new ApiError(400,"no tweets available")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,tweets,"tweets fetched successfully")
    )
});

const addTweet = asyncHandler(async (req, res) => {
    const { content } = req.body; // Extract content from the request body
    const owner = req.user._id; // Assuming req.user is set by an authentication middleware

    const user = await User.findById(owner);
    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const tweet = await Tweet.create({ content, owner });

    return res.status(200).json(
        new ApiResponse(200, "Tweet added successfully", tweet)
    );
});

const updateTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;
    const content = req.body;
    if(!content){
        throw new ApiError(400,"content is required")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"tweet not found")
    }
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400,"you are not the owner of this tweet")
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, content, {new: true})
    return res.status(200)
    .json(
        new ApiResponse(200,updateTweet,"Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(400, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "You are not the owner of this tweet");
    }

    await tweet.deleteOne();    

    return res.status(200).json(
        new ApiResponse(200, "Tweet deleted successfully")
    );
});

export {
    getTweets
    ,addTweet
    ,updateTweet
    ,deleteTweet
}