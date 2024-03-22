import { InferSchemaType } from "mongoose";
import clinics from "./clinics";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
/**
 * time: The date and time of the registered slot
 * availability: The availability of the registered slot
 * booked: Whether the slot is booked or not
 * emergencyScore: The emergency indicator for the patient
 */
const emergencySlotSchema = new Schema({
  start: {
    type: Date,
    required: [true, "Date and time must be registered"],
  },
  end: {
    type: Date,
    required: [true, "Date and time must be registered"],
  },
  booked: {
    type: Boolean,
    default: false,
  },
  clinic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: clinics,
    required: true,
  },
  dentist_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
  },
});

export default mongoose.model("EmergencySlot", emergencySlotSchema);
export type Slot = InferSchemaType<typeof emergencySlotSchema>;
