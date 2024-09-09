import { Router } from "express";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import { getSubscribedChannel, toggleSubscription, userChannelSubscribers } from "../controllers/subscriber.controller.js";

const router = Router();
// test successfully
router.route("/:channelId/userChannelSubscriber").get(verifyJWT,userChannelSubscribers);
router.route("/:channelId/addSubscriber").post(verifyJWT,toggleSubscription);
router.route("/subscribedTo").get(verifyJWT,getSubscribedChannel);

export {
    router
}