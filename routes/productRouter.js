import express from "express";
import { createProduct, deleteProduct, getProduct } from "../Controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getProduct);
productRouter.get("/:name",getProduct);
productRouter.post("/",createProduct);
productRouter.delete("/:name",deleteProduct)



export default productRouter;


