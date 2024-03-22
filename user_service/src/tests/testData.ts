const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Users";

import mongoose from "mongoose";
import User from "../schemas/users";


async function insertData() {
  const connection = await mongoose.connect(mongoURI);
  console.log(`Connected to MongoDB with URI: ${mongoURI}`);

  try {
    await mongoose.connection.dropDatabase();
    console.log("DB dropped");

    // Test data for  schemas

    const user = await new User({
      firstName: "Test",
      lastName: "User",
      birthDay: "2023-11-06",
      postCode: 47141,
      email: "example@example.com",
      password: "",
      admin: false,
    }).save();
    console.log("Inserted test user");
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
