import mongoose, { Schema, InferSchemaType }  from "mongoose";



const dentistSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Name must be entered"]
    },
    lastName: {
        type: String,
        required: [true, "Name must be entered"]
    }, SSN: { type: String, required: true, unique: true },
    
    email: {
        type: String,
        required: [true, "Email must be set"],
        unique: true,
        // regex source: https://regexr.com/3e48o
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "This is not a valid email address"],
    },
    password: { 
        type: String,
        required: [true, "Password must be set"]
    },
    admin: { type: Boolean, default: false },
   
    clinic_id: {
        type: String,
         
      },
    
});

export default mongoose.model("Dentist", dentistSchema);

export type Dentist = InferSchemaType<typeof dentistSchema>;