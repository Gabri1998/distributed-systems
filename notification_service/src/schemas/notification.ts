import mongoose, { Schema, InferSchemaType } from "mongoose";

const notificationSchema= new Schema({

    user_id:{
  type : String,
  required:true

    },
    note:{
        type : String,
        required:true

    },
    type:{
        type : String,
        required:true
    },
    readByUser:{
        type:Boolean,
        default:false
    },
})

export default mongoose.model("Notification",notificationSchema);
export type Notification=InferSchemaType<typeof notificationSchema>;
