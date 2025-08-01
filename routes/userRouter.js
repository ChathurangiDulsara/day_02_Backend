import express from "express";

import {createUser,loginUser,getUser, googleLogin} from "../Controllers/usersController.js";

const userRouter = express.Router();

userRouter.get("/",getUser);
userRouter.post("/google",googleLogin);
userRouter.post("/",createUser);
userRouter.post("/login",loginUser);


export default userRouter;

