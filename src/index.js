import dotenv from 'dotenv';
import connectDB from "./db/index.js";
dotenv.config({path:'./env'});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("mongo db connection failed !!",error)
})







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
