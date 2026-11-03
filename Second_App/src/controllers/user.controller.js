import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import User from "../models/user.models.js";
import { Op, where } from "sequelize";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import apiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // step 1: get user details from user
  // step 2: validation for backend side
  // step 3: check if already exists: username,email
  // step 4: check images, avatar image
  // step 5: upload on cloudinary, avatar
  // step 6: create user object using sequlize - create entry in db calls
  // step 7: remove password and refresh token field from response
  // step 8: check for user creation
  // step 9: return response

  // receive formdata and json data using req.body
  const { username, email, fullname, password } = req.body;
  /* console.log("username", username);
   console.log("email", email);
   console.log("fullname", fullname);
   console.log("password", password);*/

  /* if ((fullname === "" || email === "" || username === "" || password === "")) {
     throw new apiError(500, "All fields are required");
   }*/

  const fields = [username, email, fullname, password];
  // use some method for if any condition is true then execute thsi
  if (fields.some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    where: {
      // use op for use the operator from sequelize and use for multiple condtion list
      [Op.or]: [{ username }, { email }],
    },
  });
  console.log("Existing user:",existedUser);
  if (existedUser) {
    throw new apiError(409, "Username and email is already exist");
  }

  // receive the path
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar image is required");
  }

  // upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar image is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    fullname,
    password,
  });

  const createdUser = user.toJSON(); //convert to js object

  delete createdUser.password;
  delete createdUser.refreshToken;

  if (!createdUser) {
    throw new apiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered successfully"));
});

export default registerUser;
