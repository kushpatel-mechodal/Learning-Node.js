import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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
); // receive json data

app.use(
  express.urlencoded({
    limit: "50kb",
  })
); //use for receive data to url

app.use(express.static("public")); //use for temporary files such as images,videos
app.use(cookieParser()); //use for server side to access and set cookies for browser and securely perform the crud operation

// Routes import

import userRouter from "./routes/user.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);


export default app;
