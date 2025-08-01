import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const app= express();
 

const mongoUrl= process.env.MONGO_DB_URL;

app.use(cors())

const connection= mongoose.connect(mongoUrl)

mongoose.connection.once("open",()=>{
    console.log("Database Connected");
});

mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

app.use(bodyParser.json())

app.use(
    (req,res,next)=>{
    
        const token = req.header("Authorization")?.replace("Bearer ", "")
        console.log(token)

        if(token!= null){
            jwt.verify(token,process.env.SECRET,(error,decoded)=>{
                if(!error){
                    req.user = decoded 
                    console.log("User authenticated:", req.user);

                }
            })
        }next()
    }  
    
)

app.use("/api/products",productRouter)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter);


app.listen(5000,
    ()=> {
        console.log("Server is running on port 5000")
        console.log("Thank You")
});
