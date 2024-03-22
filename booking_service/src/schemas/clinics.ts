import mongoose, { Schema, InferSchemaType } from "mongoose";

const clinicSchema = new Schema({
  clinicName: {
    type: String,
    required: [true, "Clinic name must be registered"],
  },
  address: {
    type: String,
    unique: true,
    required: [true, "Address must be registered"],
  },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  workingDentists: [
    {
      type: String,
    },
  ],
});

export default mongoose.model("Clinic", clinicSchema);
export type Clinic = InferSchemaType<typeof clinicSchema>;
