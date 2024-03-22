import { InferSchemaType } from "mongoose";
import mongoose, { Schema, Document } from "mongoose";
import { checkOverBarrier } from "../emergency-service/score-barrier";
import { checkBlackList } from "../emergency-service/ban-checker";
import { isActivated } from "../emergency-service/score-comparer";

interface IScore extends Document {
  emergencyScore: number;
  userId: string;
  blackList?: boolean;
  isEmergency?: boolean;
  createdAt: Date;
}

const scoreSchema = new Schema({
  emergencyScore: {
    type: Number,
    required: [true, "Emergency Score must be registered"],
  },
  userId: {
    type: String,
    required: [true, "User Id must be registered"],
  },
  blackList: {
    type: Boolean,
    // required: [true, "Blacklist information must be included"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

scoreSchema.virtual("isEmergency").get(async function (this: IScore) {
  const isOverBarrier = checkOverBarrier(this.emergencyScore);

  if (isOverBarrier) {
    console.log("Proceeding to the second filter");
    try {
      const activated = await isActivated(this.emergencyScore);
      return activated;
    } catch (error) {
      console.error("Error in isActivated:", error);
      return false;
    }
  }

  return false;
});

const ScoreModel = mongoose.model<IScore>("Score", scoreSchema);
export default ScoreModel;
export type Score = InferSchemaType<typeof scoreSchema>;

// I had some help from chat GPT with this part because I am not familiar with creating derived attributes from a pipeline.
