import { Router } from "express";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import { addSubscriber, following, getAllSubscriber, unSubscribe } from "../controllers/subscriber.controller.js";

const router = Router();
// test successfully
router.route("/:channelId/getAllSubscriber").get(getAllSubscriber);
router.route("/:channelId/addSubscription").post(verifyJWT,addSubscriber);
router.route("/:channelId/unsubscribe").delete(verifyJWT,unSubscribe);
router.route("/:channelId/following").get(verifyJWT,following);

export {
    router
}