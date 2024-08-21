import mongoose,{Schema} from "mongoose";
import { User } from "./User.model";

const SubscribtionSchema = new mongoose.Schema({
    subscriber:{
        type:[
            {
                type:Schema.Types.ObjectId,
                ref:User,
            }
        ]
    },
    channel:{
        type:{
            type:Schema.Types.ObjectId,
            ref:User,
        }
    }
},
{timestamps:true}
);

export const  Subscribtion = mongoose.model("Subscriber",SubscribtionSchema);