import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import connectDB from "./db/database";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    "MongoDB connection failed", err;
  });
