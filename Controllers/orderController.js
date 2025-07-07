import Order from "../models/Order.js";
import { isCustomer } from "./usersController.js";

export async function createOrder(req, res) {
    if (!isCustomer(req, res)) {
        res.json({
            message:"Please login as customer to create Orders"
        })
            
        }
    //cbc001
    //take the latest productId
    const order = new Order(req.body);
    try {
        const latestOrder = await Order.find().sort({date: -1}).limit(1)//output an array an limit to one;
        let orderId;

        if (latestOrder.length == 0) {
            orderId = "CBC001"; // If no orders exist, start with cbc001
        } else {
            // Extract the last orderId and increment it 
            const currentOrdeId = latestOrder[0].orderId;
            const numberString = currentOrdeId.replace("CBC", "");
            const newNumber= parseInt(numberString);// Convert to number
            
            orderId = "CBC" + String(number + 1).toString().padStart(4, '0'); // Increment and format to 4 digits  
            orderId = "CBC" +newNumber;
        }
        const newOrder = req.body;  
        newOrder.orderId = orderId; // Assign the new orderId
        newOrder.email = req.user.email;

        const order = new Order(newOrder);
        await order.save();

    
     }catch (error) {
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
}
