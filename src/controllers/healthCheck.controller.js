import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const healthCheck = asyncHandler(async(req,res)=>{
    // build a healthChecker response that simply returns the ok status with the message
    const  healthCheckerResponse = {
        status: "ok",
        message: "Server is running and healthy",
        }
        // return the healthChecker response as a json response 
        res.json(healthCheckerResponse);
});

export {healthCheck};