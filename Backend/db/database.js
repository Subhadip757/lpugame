import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `✅ MongoDB Connected Successfully !! HOST:${connectionInstance}`
    );
  } catch (error) {
    console.error("❌ MongoDB Connection FailedFailed:", error);
    process.exit(1);
  }
};

export default connectDB;
