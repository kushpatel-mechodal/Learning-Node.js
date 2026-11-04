import apiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import User from "../models/user.models";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("bearer", "");

    if (!token) {
      throw new apiError(401, "Unauthorized user request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findByPk(decodedToken?.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new apiError(401, "Invalid access token");
    }

    req.user = user; //add the user information
    next(); //execute next middleware
  } catch (error) {
    throw new apiError(401, error?.message || "invalid access token");
  }
});
