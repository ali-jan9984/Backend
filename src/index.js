require("dotenv").config({path:"./env"});
import connectDB from "./db/index.js";








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
