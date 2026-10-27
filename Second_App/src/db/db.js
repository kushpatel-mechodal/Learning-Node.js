import mongoose from "mongoose";
import { DB_NAME } from "../constant";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("db connection",connectionInstance.connection.host);
  } catch (error) {
    console.log("Failed to connect mongodb", error.message);
    process.exit(1);
  }
};

connectDB();