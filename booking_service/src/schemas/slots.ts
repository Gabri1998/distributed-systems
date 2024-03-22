import { InferSchemaType } from "mongoose";
import clinics from "./clinics";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * time: The date and time of the registered slot
 * availability: The availability of the registered slot
 */
const slotSchema = new Schema({
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
    required: false,
  },
  dentist_id: {
    type: String,
    required: true,
  },
  patient_id: {
    type: String,
    required: false,
  }
});
slotSchema.index({start:1,dentist_id:1},{unique:true})
export default mongoose.model("Slot", slotSchema);
export type Slot = InferSchemaType<typeof slotSchema>;
