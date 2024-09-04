import mongoose from 'mongoose';

const  likeSchema = new mongoose.Schema({
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video'
    },
    likeBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tweet',
    }
},{
    timestamps:true,
});

export const Like = mongoose.model("Like",likeSchema);