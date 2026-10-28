import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constant.js";
import express from "express";
import dotenv from "dotenv/config";
import connectDB from "./db/db.js";

const app = express();

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT;

    app.on("error", (error) => {
      console.log("App is not connect to database", error.message);
      process.exit(1); //if any error then stop execution
    });

    app.listen(port, () => {
      console.log(`Server is running on PORT: ${port}`);
    });
  } catch (error) {
    console.log("Failed to connect database: ", error.message);
    process.exit(1); //if any error then stop execution
  }
};

startServer();
