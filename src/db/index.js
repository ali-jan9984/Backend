import mongoose from 'mongoose';
import { dbName } from '../constants.js';

const connectDB = async () => {
    try {
        const connectionInstances = await mongoose.connect(`${process.env.MONGODBURL}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`\nMongoDB connected!! DB Host: ${connectionInstances.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
};

export default connectDB;
