import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        trim:true,
        unique:true
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video',
        }
    ]
},
{
    timestamps:true
}
)
export const Playlist = mongoose.model("Playlist",playlistSchema);