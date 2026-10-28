import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("Database connected to server:", connectionInstance.connection.host);
    
  } catch (error) {
    console.log("Failed to connect mongodb", error.message);
    process.exit(1);
  }
};

connectDB();

export default connectDB;
