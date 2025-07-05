  import mongoose from "mongoose"
  

  
  const studentSchema  = mongoose.Schema({
            name:String,
            age:Number,
            gender:String,
            grade:String
        })

        const student = mongoose.model("student",studentSchema)

export default student;

         
