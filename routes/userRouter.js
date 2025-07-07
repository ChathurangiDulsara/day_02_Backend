import express from "express";
import {createUser,loginUser,getUser} from "../Controllers/usersController.js";

const userRouter = express.Router();

userRouter.get("/",getUser);

userRouter.post("/",createUser);

userRouter.post("/login",loginUser)

export default userRouter;

