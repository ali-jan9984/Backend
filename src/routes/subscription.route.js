import { Router } from "express";
import { verifyJWT } from "../middlewares/AUTH.middlewares.js";
import { addSubscriber, getAllSubscriber } from "../controllers/subscriber.controller.js";

const router = Router();
// test successfully
router.route("/:channelId/getAllSubscriber").get(getAllSubscriber);
router.route("/addSubscription").post(verifyJWT,addSubscriber);

export {
    router
}