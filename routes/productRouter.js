import express from "express";
import { createProduct, deleteProduct, getProduct, getProductById, updateProduct } from "../Controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getProduct);
productRouter.get('/:id',getProductById)
productRouter.get("/:name",getProduct);
productRouter.post("/",createProduct);
productRouter.delete('/:id',deleteProduct)
productRouter.put('/:id',updateProduct)



export default productRouter;


