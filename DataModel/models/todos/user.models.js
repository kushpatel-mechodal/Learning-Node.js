// import mongoose module
import mongoose from "mongoose";

//create schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    pasword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// create model
export const User = mongoose.model("User", userSchema);
