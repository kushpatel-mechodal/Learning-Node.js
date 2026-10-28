import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import express from "express";
import dotenv from "dotenv/config";
import connectDB from "./db/db.js";

const app = express();
// dotenv.config();

// use IIFE for automatically execute the function
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     // use listner for sometimes app not communicate with database
//     app.on("error", (error) => {
//       console.log("App not connect with database", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`Application running on PORT: ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Failed to connect mongodb", error.message);
//     throw error;
//   }
// })();

connectDB();
