import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type:String,
        required:true,
        trim:true,
        max:140,
        min:1,
    }
},
{
    timestamps:true
}
);

export const Tweet = mongoose.model("Tweet",tweetSchema);