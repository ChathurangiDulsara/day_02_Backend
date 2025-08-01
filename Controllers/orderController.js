import Order from "../models/Order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./usersController.js";

// export async function createOrder(req, res) {
//     if (!isCustomer(req, res)) {
//         res.json({
//             message: "Please login as customer to create Orders"
//         })
//         return
//     }
//     //cbc001
//     //take the latest productId

//     try {
//         const latestOrder = await Order.find().sort({ orderId: -1 }).limit(1)
//         let orderId;

//         if (latestOrder.length == 0) {
//             orderId = "CBC0001";
//         } else {

//             const currentOrdeId = latestOrder[0].orderId;
//             const numberString = currentOrdeId.replace("CBC", "");
//             const newNumber = parseInt(numberString);

//             orderId = "CBC" + String(newNumber + 1).toString().padStart(4, '0');

//         }
//         const newOrder = req.body;

//         const newProductArray = []
//         for (let i = 0; i < newOrder.orderedItems.length; i++) {
//             const product1 = await Product.findOne({
//                 productID: newOrder.orderedItems[i].productID
//             })
//             console.log(product1)
//             if (product1 == null) {
//                 return res.status(404).json({
//                     message: "Product with " + newOrder.orderedItems[i].productID + " id not found"
//                 });
//             }

//             newProductArray[i] = {
//                 name: product1.ProductName,
//                 productID: product1.productID,
//                 price: product1.LastPrice,
//                 quantity: newOrder.orderedItems[i].quantity,
//                 image: product1.image[0]


//             }

//         }

//         for (let y = 0; y < newProductArray.length; y++) {
//             if (newProductArray[y].quantity <= 0) {
//                 return res.status(400).json({
//                     message: "Quantity must be greater than zero for product " + newProductArray[y].productID
//                 });
//             }
//         }

//         for (let a = 0; a < newProductArray.length; a++) {
//             const product1 = await Product.findOne({
//                 productID: newProductArray[a].productID
//             })
//             if (product1.stock < newProductArray[a].quantity) {
//                 return res.status(400).json({
//                     message: "Insufficient stock for product " + newProductArray[a].productID
//                 });
//             }
//         }

//         newOrder.orderId = orderId;
//         newOrder.email = req.user.email;

//         const order = new Order(newOrder);
//         await order.save();

//         res.status(201).json({
//             order: order.save(),
//             message: "Order created successfully"
//         });


//     } catch (error) {
//         res.status(500).json({
//             message: "Error creating order",
//             error: error.message
//         });
//     }
// }


export async function createOrder(req, res) {
  if (!isCustomer(req, res)) {
    return res.status(401).json({
      message: "Please login as customer to create orders",
    });
  }

  try {
    
    const latestOrder = await Order.find().sort({ orderId: -1 }).limit(1);
    let orderId;

    if (latestOrder.length === 0) {
      orderId = "CBC0001";
    } else {
      const currentOrderId = latestOrder[0].orderId;
      const numberString = currentOrderId.replace("CBC", "");
      const number = parseInt(numberString, 10);
      const newNumber = (number + 1).toString().padStart(4, "0");
      orderId = "CBC" + newNumber;
    }

    const newOrderData = req.body;
    const newProductArray = [];

    let total = 0;       
    let labeledTotal = 0; 

  
    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const orderItem = newOrderData.orderedItems[i];
      const productID = orderItem.productID;
      const quantity = orderItem.quantity;

      
      if (quantity <= 0) {
        return res.status(400).json({
          message: `Quantity must be greater than zero for product ${productID}`,
        });
      }

     
      const product = await Product.findOne({ productID });
      if (!product) {
        return res.status(404).json({
          message: `Product with id ${productID} not found`,
        });
      }

      
      if (product.stock !== undefined && product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${productID}`,
        });
      }

     
      newProductArray.push({
        productID,
        name: product.ProductName,
        price: product.LastPrice,     
        quantity,
        image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "",

      });


      total += product.LastPrice * quantity;
      labeledTotal += (product.price ?? product.LastPrice) * quantity;
    }

    if (!labeledTotal) labeledTotal = total;

    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;  
    newOrderData.orderedItems = newProductArray;
    newOrderData.total = total;
    newOrderData.labeledTotal = labeledTotal;
    newOrderData.discount = labeledTotal - total;
    const order = new Order(newOrderData);
    const savedOrder = await order.save();


    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
}


export async function getOrdersById(req, res) {
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(400).json({
            message: "Order ID is required",
        });
    }

    try {
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                message: `Order with ID ${orderId} not found`,
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching order",
            error: error.message,
        });
    }
}


export async function getOrders(req, res) {
    try {
        console.log("getOrders called");

        if (!req.user) {
            return res.status(401).json({
                message: "Please login to view orders",
            });
        }

        const orders = await Order.find({});

        // Add totals for each order before sending
        const ordersWithTotals = orders.map(order => {
            let total = 0;
            let labeledTotal = 0;
            for (const item of order.orderedItems) {
                // Use stored price (if stored in order's orderedItems)
                const price = item.LastPrice ?? 0;
                const labeled = item.labeledPrice ?? item.price ?? 0;
                const quantity = item.quantity ?? 0;
                total += price * quantity;
                labeledTotal += labeled * quantity;
            }
            return {
                ...order.toObject(),
                total,
                labeledTotal,
                discount: labeledTotal - total
            };
        });

        return res.status(200).json(ordersWithTotals);

    } catch (error) {
       
    }
}


export async function getQuotation(req, res) {
    console.log("GET QUOTATION CALLED");
    try {
        const newOrder = req.body;
        console.log("Request body:", req.body);

        let total = 0;
        let labeledTotal = 0;
        const newProductArray = [];

        for (let i = 0; i < newOrder.orderedItems.length; i++) {
            const orderedItem = newOrder.orderedItems[i];
            const product1 = await Product.findOne({ productID: orderedItem.productID });

            console.log("Product found:", product1);
            console.log("Looking for product with productID:", orderedItem.productID);


            if (product1 == null) {
                return res.status(404).json({
                    message: "Product with ID " + orderedItem.productID + " not found"
                });
            }

            labeledTotal += product1.price*newOrder.orderedItems[i].quantity;
            total += product1.LastPrice*newOrder.orderedItems[i].quantity;
            newProductArray[i] = {
                name: product1.ProductName,
                productID: product1.productID,
                LastPrice: product1.LastPrice,
                labeledPrice: product1.price,
                quantity: orderedItem.quantity,
                image: product1.image[0]

            };
        }

         newOrder.orderedItems = newProductArray;
         newOrder.total = total;
         newOrder.labeledTotal = labeledTotal;

        console.log("Calculated totals:", { total, labeledTotal });
        console.log("Product array:", newProductArray);

        res.status(200).json({
            orderedItems: newProductArray,
            total: total,
            labeledTotal: labeledTotal,
            

        });

    } catch (error) {
        console.error("Error in getQuotation:", error);
        return res.status(500).json({
            message: "Error fetching order",
            error: error.message,
        });
    }
}



export async function updateOrder(req, res) {
    if (!isAdmin(req)) {
        res.json({
            message: "Please login as admin to update orders",
        });
    }

    try {
        const orderId = req.params.orderId;

        const order = await Order.find({
            orderId: orderId,
        });

        if (order == null) {
            res.status(404).json({
                message: "Order not found",
            })
            return;
        }

        const notes = req.body.notes;
        const status = req.body.status;

        const updateOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { notes: notes, status: status }
        );

        res.json({
            message: "Order updated",
            updateOrder: updateOrder
        });

    } catch (error) {


        res.status(500).json({
            message: error.message,
        });
    }
}



