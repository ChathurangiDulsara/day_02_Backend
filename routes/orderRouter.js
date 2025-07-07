import express from "express";
import { createOrder } from "../Controllers/orderController.js"; 
const orderRouter = express.Router();

// orderRouter.get("/", getOrders);
orderRouter.post("/", createOrder);         