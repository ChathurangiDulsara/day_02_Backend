import product from "../models/product.js"

export async function getProduct(req,res){
        
        try{

           const productList = await product.find()
           res.json({
            list:productList
        })
       }catch{
        res.json({
            message:"Error"
    })
}
        
}

export function getProductByName(req,res){
    const name= req.params.name;

       product.find(name,name).then(

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



export function createProduct(req,res){

    if(!isAdmin(req.user)){
        res.json({
            message:"Please login as administrator to Create admin accounts"
        })
        return

    }
    
         const newProduct = new product(req.body)

        newProduct.save().then(
        ()=> {
            res.json({
                message:"Product Created"
            })
        }

        
        ).catch(
            (error)=>{
                res.json({
                    message:"Error"
                }
            )}
        )
    }

    export function deleteProduct(req,res) {
        product.deleteOne({name:req.params.name}).then(
            ()=>{res.json({
                message :"Product deleted Successfully"
             } )
        }
    ) 

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
        
