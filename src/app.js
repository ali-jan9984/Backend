import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Set up CORS with credentials
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// Set up middleware to handle JSON and URL-encoded form data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Use cookie-parser to handle cookies
app.use(cookieParser());

// Import and use routes
import { router as userRouter } from './routes/user.route.js';
import {router as videoRouter} from './routes/video.route.js';
import {router as commentRouter} from './routes/comment.route.js';
import {router as playlistRouter} from './routes/playlist.route.js';
import {router as likeRouter} from './routes/like.route.js';
import {router as tweetRouter} from './routes/tweet.route.js';
import {router as subscriptionRouter} from './routes/subscription.route.js';
app.use("/api/v1/users", userRouter);
app.use("/api/v1/video",videoRouter);
app.use("/api/v1/comment",commentRouter);
app.use("/api/v1/playlist",playlistRouter);
app.use("/api/v1/like",likeRouter);
app.use("/api/v1/tweet",tweetRouter);
app.use("/api/v1/subscription",subscriptionRouter);

export { app };
