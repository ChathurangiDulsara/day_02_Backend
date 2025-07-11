import mongoose from "mongoose";
import product from "./product.js";

const orderSchema = mongoose.Schema({
    orderId:{
        type:String,
        required:true,
        unique:true
    },
    orderedItems:[
        {
            productName:{
                type:String,
                required:true
            },
            productId:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            }
        }
    ],
    date:{ 
        type:Date,
        default:Date.now
    },
    paymentId:{
        type:String
    },
    status:{
        type:String,
        default:"Preparing"
    },
    Notes:{
        type:String,
        default:"No Notes"
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:"String",
        required:true
    },
    phone:{
        type:String,
        required:true
    }



})

const Order = mongoose.model("order",orderSchema)

export default Order;