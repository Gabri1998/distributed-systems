import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name must be entered"],
  },
  lastName: {
    type: String,
    required: [true, "Last name must be entered"],
  },
  SSN: { type: String, required: true, unique: true },

  email: {
    type: String,
    required: [true, "Email must be set"],
    unique: true,
    // regex source: https://regexr.com/3e48o
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "This is not a valid email address",
    ],
  },
  password: { type: String, required: [true, "Password must be set"] },
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  blackList: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model("User", userSchema);

export type User = InferSchemaType<typeof userSchema>;
