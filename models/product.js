import mongoose from "mongoose"
  
  
  const productSchema  = mongoose.Schema({
    productID:{
      type:String,
      required:true,  
      unique:true
    },
    ProductName :{
      type:String,
      required:true
    },
    altNames:[
      {
        type:String,
        required:true
      }
    ],

    image:[
      {
        type:String,
      
      }
    ],
    price:{
      type:Number,
      required:true
    },
    LastPrice:{
      type:Number,
      required:true
    },

    description:{
      type:String,
      required:true
    },
    stock:{
      type:Number,
      required:true
    }

  })
           

const Product = mongoose.model("product",productSchema)

export default Product;
