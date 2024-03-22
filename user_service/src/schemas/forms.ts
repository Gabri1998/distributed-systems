import mongoose from "mongoose"

const Schema = mongoose.Schema;


const formSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    priorityScore: { type: Number },
    submittedAt: { type: Date, default: Date.now },
  });

export default mongoose.model("Form", formSchema);