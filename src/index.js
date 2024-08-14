import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js'; // Import the app from app.js

// Load environment variables
dotenv.config();

// Debugging: Check if the environment variable is loaded
console.log('MongoDB URI:', process.env.MONGODB_URI);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit if the connection fails
  });









// ;(async()=>{
//     try {
//       await  mongoose.connect(`${process.env.MONGODBURL}/${dbName}`)
//       app.on("error",(error)=>{
//         console.error("Error in server",error);
//         throw error
//       })
//       app.listen(process.env.PORT,()=>{
//         console.log(`App is listning on port ${process.env.PORT}`)
//       })
//     } catch (error) {
//         console.erro("ERROR",error)
//         throw error
//     }
// })();
