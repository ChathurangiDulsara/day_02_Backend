import express from "express";
import { createOrder, getOrders, getOrdersById, getQuotation, updateOrder } from "../Controllers/orderController.js"; 
const orderRouter = express.Router();


orderRouter.post("/quote",getQuotation);
orderRouter.get("/", getOrders);
orderRouter.post("/", createOrder);
orderRouter.get("/:orderId",getOrdersById);
orderRouter.put("/:id",updateOrder);



export default orderRouter;