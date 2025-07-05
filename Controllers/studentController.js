import student from "../models/student.js"


export function getStudents(req,res){
        student.find().then(
            (studentList)=>{
               res.json({
                list:studentList 
            })
        })}


export function createStudent(req,res){
      
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
    }

    export function deleteStudent(req,res) {
        student.deleteOne({name:req.body.name}).then(
            ()=>{res.json({
                message :"Student deleted Successfully"
             } )
        }
    ) 

 }
        
