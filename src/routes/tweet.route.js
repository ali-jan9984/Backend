import { Router } from "express";
import {verifyJWT} from "../middlewares/AUTH.middlewares.js";
import { addTweet, deleteTweet, getTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();
// text successfully
router.route("/getallTweets").get(verifyJWT,getTweets);
// test successfully
router.route("/addTweet").post(verifyJWT,addTweet);
// test successfully
router.route("/:tweetId/updateTweet").patch(verifyJWT,updateTweet);
// test successfully
router.route("/:tweetId/deleteTweet").delete(verifyJWT,deleteTweet)

export{
    router
}