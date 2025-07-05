import express from "express";
import {getStudents,createStudent,deleteStudent} from "../Controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.get("/",getStudents);
studentRouter.post("/",createStudent);
studentRouter.delete("/",deleteStudent)


/**studentRouter.post("/",
    (req,res)=>{

        console.log("post request is received")
        res.json({
            message:"post request is received"
        })

    }
        );
**/


export default studentRouter;


