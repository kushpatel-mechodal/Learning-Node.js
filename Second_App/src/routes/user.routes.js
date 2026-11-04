import { Router } from "express";
import {
  loginUser,
  logOutUser,
  registerUser,
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

export default userRouter;
