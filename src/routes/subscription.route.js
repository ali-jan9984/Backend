import { Router } from "express";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import { getSubscribedChannel, getSubscriber, toggleSubscription} from "../controllers/subscriber.controller.js";

const router = Router();
// test successfully
router.route("/:channelId/toggleSubscription").post(verifyJWT,toggleSubscription);
// test equally
router.route("/:channelId/userChannelSubscriber").get(getSubscriber);
// problem equally
router.route("/subscribedTo").get(verifyJWT,getSubscribedChannel);

export {
    router
}