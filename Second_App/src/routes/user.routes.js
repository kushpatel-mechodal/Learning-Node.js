import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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

export default userRouter;
