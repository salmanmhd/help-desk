import mongoose from "mongoose";
import "dotenv/config";
async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`db connected`);
  } catch (error) {
    console.log(`Error connecting to DB`, error);
  }
}

export { connectDb };
