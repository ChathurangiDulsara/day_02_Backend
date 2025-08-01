import Product from "../models/product.js"

export async function getProduct(req,res){
        
        try{

           const productList = await Product.find()
           res.status(200).json({
            list:productList
        })
       }catch{
        res.status(403).json({
            message:"Error"
    })
}
        
}

export function getProductByName(req,res){
    const name= req.params.name;

       Product.find(name,name).then(

            (productList)=>{


                if(productList.length==0){

                    res.json({
                        message:"Product Is Not Found"
                    })

                }
                else{
                    res.status(200).json({
                        list:productList                 
                      })
                }
              
            }).catch(
                ()=>{
                    res.json({
                        message:"product is Created"
                    })
                }
            )
}

export function createProduct(req, res) {
    if (!isAdmin(req.user)) {
        return res.status(403).json({
            message: "Please login as administrator to add products"
        });
    }

    const newProduct = new Product(req.body);

    newProduct.save()
        .then(() => {
            res.status(201).json({
                message: "Product created successfully"
                
            });
            console.log("Received product data:", req.body);
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error creating product"+error,
                error: error.message 
            });
        });

}

export async function deleteProduct(req, res) {
    if (!isAdmin(req.user)) {
        return res.status(403).json({
            message: "Please login as administrator to delete products"
        });
    }

    const productId = req.params.id; 

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required in URL parameter" });
    }

    try {
        const product = await Product.findOne({ productID: productId });

        if (!product) {
            return res.status(404).json({ 
                message: `Product with ID ${productId} not found`
             });
        }

        await Product.deleteOne({ _id: product._id });

        res.status(200).json({
             message: `Product ${productId} deleted successfully`
             });

    } catch (err) {
        return res.status(500).json({ 
            message: "Error: " + err.message 
        });
    }
}


 export function isAdmin(user){
    if(user == null){
        return false
    }

    if(user.type != "admin"){
        return false
    }
    
    
    return true
}
    
export async function updateProduct(req, res) {
  if (!isAdmin(req.user)) {
    return res.status(403).json({
      message: "Please login as administrator to update products"
    });
  }

  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required in URL parameter" });
  }

  try {
    const product = await Product.findOne({ productID: productId });

    if (!product) {
      return res.status(404).json({
        message: `Product with ID ${productId} not found`
      });
    }

    const updatedData = { ...req.body };
    delete updatedData._id;

    await Product.updateOne({ _id: product._id }, updatedData);

    res.status(200).json({
      message: `Product ${productId} updated successfully`
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error: " + err.message
    });
  }
}

export async function getProductById(req, res) {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required in the URL parameter"
      });
    }
    const product = await Product.findOne({ productID: productId });


    if (!product) {
      return res.status(404).json({
        message: "Product with ID" +productId+" not found"
      });
    }

   
    return res.status(200).json({
      product
    });

  } catch (error) {
    console.error("Error in getProductById:", error);
    return res.status(500).json({
      message: "Error fetching product by ID",
      error: error.message
    });
  }
}
