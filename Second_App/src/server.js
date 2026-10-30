import express from "express";
import "dotenv/config";
import connectDB from "./db/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import user from "./models/user.models.js";

const app = express();

//middleware configuration

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); //use middleware

app.use(
  express.json({
    limit: "50kb",
  })
);

app.use(
  express.urlencoded({
    limit: "50kb",
  })
); //use for receive data to url

app.use(express.static("public")); //use for temporary files such as images,videos

app.use(cookieParser()); //use for server side to access and set cookies for browser and securely perform the crud operation

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    await user.describe();
    console.log(
      "user and video model connected with existing table successfully"
    );

    const port = process.env.PORT || 8000;

    app.on("error", (error) => {
      console.log("App is not connect to database", error.message);
      process.exit(1); //if any error then stop execution
    });

    app.listen(port, () => {
      console.log(`Server is running on PORT: ${port}`);
    });
  } catch (error) {
    console.log("Failed to connect database: ", error.message || error);
    process.exit(1); //if any error then stop execution
  }
};

startServer();
