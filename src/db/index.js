import mongoose from 'mongoose';
import { dbName } from '../constants.js';

const connectDB = async () => {
    const uri = `${process.env.MONGODB_URI}/${dbName}`;
    try {
        const connectionInstances = await mongoose.connect(uri);
        console.log(`\nMongoDB connected!! DB Host: ${connectionInstances.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); 
    }
};

export default connectDB;


