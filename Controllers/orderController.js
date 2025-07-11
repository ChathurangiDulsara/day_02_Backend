import Order from "../models/Order.js";
import product from "../models/product.js";
import { isCustomer } from "./usersController.js";

export async function createOrder(req, res) {
    if (!isCustomer(req, res)) {
        res.json({
            message:"Please login as customer to create Orders"
        })
    }
    //cbc001
    //take the latest productId

    try {
        const latestOrder = await Order.find().sort({date: -1}).limit(1)//output an array an limit to one;
        let orderId;

        if (latestOrder.length == 0) {
            orderId = "CBC0001"; // If no orders exist, start with cbc001
        } else {
            // Extract the last orderId and increment it 
            const currentOrdeId = latestOrder[0].orderId;
            const numberString = currentOrdeId.replace("CBC", "");
            const newNumber= parseInt(numberString);// Convert to number
            
            orderId = "CBC" + String(newNumber + 1).toString().padStart(4, '0'); // Increment and format to 4 digits  
        
        }
        const newOrder = req.body;  

        const newProductArray =[]
        for(let i=0;i<newOrder.orderedItems.length; i++){
            const product1 = await product.findOne({
                productID: newOrder.orderedItems[i].productID
            })
            console.log(product1)
            if(product1 ==null){
                return res.status(404).json({
                    message: "Product with " +newOrder.orderedItems[i].productID + " id not found"
                });
            }

            newProductArray[i]={
                name:product1.ProductName,
                productID: product1.productID,
                price: product1.price,  
                quantity: newOrder.orderedItems[i].quantity,
                image:product1.image// Assuming you want the first image   


            }

        }

        for(let y=0; y < newProductArray.length; y++) {
            if (newProductArray[y].quantity <= 0) {
                return res.status(400).json({
                    message: "Quantity must be greater than zero for product " + newProductArray[y].productID
                });
            }
        }

        for(let a=0; a<newProductArray.length; a++){
            const product1 = await product.findOne({
                productID: newProductArray[a].productID
            })
            if(product1.stock < newProductArray[a].quantity){
                return res.status(400).json({
                    message: "Insufficient stock for product " + newProductArray[a].productID
                });
            }
        }


        newOrder.orderId = orderId; // Assign the new orderId
        newOrder.email = req.user.email;

        const order = new Order(newOrder);
        await order.save();

        res.status(201).json({
        message: "Order created successfully"
        });

    
     }catch (error) {
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
}
