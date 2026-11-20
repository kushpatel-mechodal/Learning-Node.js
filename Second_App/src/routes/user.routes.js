import { Router } from "express";
import {
  loginUser,
  logOutUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateUserAvatar,
  updateUserCoverImage,
  updateAccount,
  getUserChannel,
  getWatchHistory,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1, //receive 1 file
    },
    {
      name: "coverImage",
      maxCount: 1, //receive 1 file
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logOutUser);
userRouter.route("/refreshToken").post(refreshAccessToken);
userRouter.route("/changePassword").post(verifyJWT, changeCurrentPassword);
userRouter.route("/getCurrentUser").post(verifyJWT, getCurrentUser);
userRouter.route("/updateAccount").patch(verifyJWT, updateAccount);
userRouter
  .route("/updateUserAvatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);
userRouter
  .route("/updateUserCoverImage")
  .post(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
userRouter.route("/c/:username").get(verifyJWT, getUserChannel);
userRouter.route("/getWatchHistory").get(verifyJWT, getWatchHistory);

export default userRouter;
