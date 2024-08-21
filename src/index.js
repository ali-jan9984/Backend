import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js'; 

dotenv.config();

connectDB()
  .then(() => {
    const PORT =process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
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
