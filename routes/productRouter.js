import express from "express";
import { createProduct, deleteProduct, getProduct } from "../Controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getProduct);
productRouter.get("/:name",getProduct);
productRouter.post("/",createProduct);
productRouter.delete("/:name",deleteProduct)


/**studentRouter.post("/",
    (req,res)=>{

        console.log("post request is received")
        res.json({
            message:"post request is received"
        })

    }
        );
**/


export default productRouter;


