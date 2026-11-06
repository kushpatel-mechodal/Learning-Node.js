import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import User from "../models/user.models.js";
import { Op, where } from "sequelize";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// import { error } from "console";

const generateAccessAndRefreshTokens = async (userid) => {
  try {
    const user = await User.findByPk(userid);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validate: false }); //not save all the record only add the save refresh token

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      error.message || "Error for generate access and refresh tokens"
    );
  }
};

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
  console.log(req.body);
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
  console.log("Existing user:", existedUser);
  console.log("req.files:", req.files);

  if (existedUser) {
    throw new apiError(409, "Username and email is already exist");
  }

  console.log(existedUser);

  // receive the path
  const avatarLocalPath = req.files?.avatar?.[0]?.path; //get the localfilepath
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path; //get the localfilepath

  console.log("Avatar path:", avatarLocalPath);
  console.log("Cover path:", coverImageLocalPath);

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

  // return the response
  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  /* step 1: get the email and password from user
     step 2: login based on email or username
     step 3: find the user
     step 4: password check
     step 5: generate access token and refresh token
     step 6: send secure cookie */

  const { email, username, password } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email }],
    },
  });

  if (!user) {
    throw new apiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id
  );

  const loggedInUser = await User.findByPk(user.id, {
    attributes: {
      exclude: ["password", "refreshToken"], //use for not send this fields
    },
  });

  // add option for securly access cookie from server side
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedin successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.update(
    {
      refreshToken: undefined,
    },
    {
      where: {
        id: req.user.id,
      },
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findByPk(decodedToken?.id);

    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh token is expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user.id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "access token generated "
        )
      );
  } catch (error) {
    throw new apiError(401, error.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user?.id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiError(401, "Enter correct password");
  }

  user.password = newPassword; //set the new password

  await user.save({
    validate: false,
  });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password change successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, "current user fetch successfully");
});

const updateAccount = asyncHandler(async (req, res) => {
  const { username, fullname, email } = req.body;

  if (!username || !fullname || !email) {
    throw new apiError(400, "All fields required");
  }

  const user = await User.update(
    {
      username,
      fullname,
      email,
    },
    {
      where: {
        id: req.user?.id,
      },
    },
    {
      attributes: {
        exclude: ["password"],
      },
    }
  );

  return res
    .status(200)
    .json(new apiResponse(200, user, "User updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new apiError(400, "Error while uploading avatar");
  }

  const user = await User.update(
    {
      avatar: avatar.url,
    },
    {
      where: {
        id: req.user?.id,
      },
    }
  );

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar image is updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new apiError(400, "cover image is required");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new apiError(400, "Error while uploading avatar");
  }

  const user = await User.update(
    {
      coverImage: coverImage.url,
    },
    {
      where: {
        id: req.user?.id,
      },
    }
  );

  return res
    .status(200)
    .json(new apiResponse(200, user, "Cover image is updated successfully"));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateUserAvatar,
  updateUserCoverImage,
  updateAccount,
};
