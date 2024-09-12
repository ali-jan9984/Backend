import { Router } from "express";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import { getSubscribedChannel, toggleSubscription, userChannelSubscribers} from "../controllers/subscriber.controller.js";

const router = Router();
// problem involves
router.route("/:channelId/toggleSubscription").get(verifyJWT,toggleSubscription);
// test successfully
router.route("/:channelId/userChannelSubscriber").post(verifyJWT,userChannelSubscribers);
// problem involves
router.route("/subscribedTo").get(verifyJWT,getSubscribedChannel);

export {
    router
}