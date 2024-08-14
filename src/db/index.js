import mongoose from 'mongoose';
import { dbName } from '../constants.js'; // Ensure dbName is correctly defined in constants.js

const connectDB = async () => {
    // Ensure the correct environment variable is used
    const uri = `${process.env.MONGODB_URI}/${dbName}`;

    try {
        // Debugging to ensure the environment variable is correctly set
        console.log('MongoDB URI:', uri);

        // Connect to MongoDB using the URI from environment variables
        const connectionInstances = await mongoose.connect(uri);
        
        console.log(`\nMongoDB connected!! DB Host: ${connectionInstances.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit if the connection fails
    }
};

export default connectDB;


