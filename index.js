import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const app= express();
 

const mongoUrl= process.env.MONGO_DB_URL;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
 useUnifiedTopology: true
});

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
        // console.log(req)
        // console.log(req.header)

        const token = req.header("Authorization")?.replace("Bearer ", "")
        console.log(token)

        if(token!= null){
            jwt.verify(token,proces.env.SECRET,(error,decoded)=>{
                if(!error){
                    req.user = decoded 
                }
            })
        }
                
            next()
    }  
    
)

app.use("/api/products",productRouter)
app.use("/api/users", userRouter)

/**app.get("/",
    (req,res)=>{
        console.log(req.body)
        console.log("Get request is received")

        let prefix="Mr"

        if(req.body.gender=="female"){
            prefix="Ms";
        }

        res.json({
            message:"Hello  "+ prefix+" "+req.body.name

        })
    });


app.post("/",
    (req,res)=>{
      
        const newStudent = new student(req.body)

        newStudent.save().then(
        ()=> {
            res.json({
                message:"Student Created"
            })
        }

        
        ).catch(
            (error)=>{
                res.json({
                    message:"Error"
                }
            )}
        )
    });

app.delete("/",
    ()=>{
        console.log("Delete request is Received")

    }
);  **/


app.listen(5000,
    ()=> {
        console.log("Server is running on port 5000")
        console.log("Thank You")
});
