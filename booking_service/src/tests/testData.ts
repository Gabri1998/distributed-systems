const  mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Bookings";

import mongoose from "mongoose";

import  Slot from"../schemas/slots";
import  Clinic from"../schemas/clinics";

async function insertData() {
    const connection = await mongoose.connect(mongoURI);
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);

    try {
    await mongoose.connection.dropDatabase();
    console.log("DB dropped");
    
    // Test data for each schemas
    const slot = await new Slot({ 
        time: "2023-12-01T13:00:00"
     }).save();
    console.log("Inserted a test slot");
    const slotId = slot._id;

   

    const clinic = await new Clinic({ 
        clinicName: "Test Clinic",
        address: "Västra Hamngatan 5, 411 17 Göteborg",
        workingDentists: []
     }).save();
    console.log("Inserted a test clinic");

   
} finally {
    await mongoose.disconnect();
}
}

(async function () {
    try {
        await insertData();
    } catch (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err);
        process.exit(1);
    }
});