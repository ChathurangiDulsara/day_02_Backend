import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config()

export function createUser(req, res) {
  
    const userData = req.body;
    userData.password = bcrypt.hashSync(userData.password, 10);
    const user = new User(userData);

    user.save().then(
        () => res.json({
            message: "user Created"
        })
    ).catch(
        (error) => {
            res.json({
                message: "user not Created"+error
            });
        }
    );
}

export function loginUser(req, res) {
    User.find({ email: req.body.email }).then(
        (users) => {
            if (users.length === 0) {
                res.json({
                    message: "User Not Found"
                });
            } else {
                const user = users[0];

            
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

                if (isPasswordCorrect) {
                    const token = jwt.sign({
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isBlocked: user.isBlocked,
                        type: user.type,
                        profilePicture: user.profilePicture
                    }, process.env.SECRET);

                    res.json({
                        message: "user logged in",
                        token: token,
                        user:{
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            isBlocked: user.isBlocked,
                            type: user.type,
                            profilePicture: user.profilePicture
                        }

                    });
                } else {
                    res.json({
                        message: "password is incorrect"
                    });
                }
            }
        }
    );
}


export function userDelete(req,res){
    User.deleteOne({email:req.body.email}).then(
        ()=>{
            res.json({
                message:"User Deleted Successfully"
            })
        }
    )

}

export function isAdmin(req, res) {
        if(req.user == null){
            return false

        }

        if(req.user.type != "admin"){
            return false 
        }
        return true
        
    }

export function isCustomer(req, res) {
        if(req.user == null){
            return false
        }

        if(req.user.type != "customer"){
            return false
        }

        return true
        
    }


export async function getUser(req, res) {
    try {
        console.log("getUser called - fetching customers"); 

        if (!req.user) {
            return res.status(401).json({
                message: "Please login to view users"
            });
        }

        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Access denied. Admin privileges required."
            });
        }

        const customersList = await User.find(
            { type: "customer" }, 
        ).sort({ createdAt: -1 });

        console.log("Customers found:", customersList.length);

        res.status(200).json(customersList);

    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            message: "Error fetching customers",
            error: error.message
        });
    }
}


export async function googleLogin(req,res){
  console.log(req.body)
  const token = req.body.token
  try{
   
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    const email = response.data.email
    
    //check if user exists
    const usersList = await User.find({email: email})
    if(usersList.length > 0){
      const user = usersList[0]
      const token = jwt.sign({
        email : user.email,
        firstName : user.firstName,
        lastName : user.lastName,
        isBlocked : user.isBlocked,
        type : user.type,
        profilePicture : user.profilePicture
      }, process.env.SECRET)
      
      res.json({
        message: "User logged in",
        token: token,
        user : {
          firstName : user.firstName,
          lastName : user.lastName,
          type : user.type,
          profilePicture : user.profilePicture,
          email : user.email
        }
      })
    } else {
     
      const newUserData = {
        email: email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        type: "customer",
        password: "ffffff", 
        profilePicture: response.data.picture
      }
      const user = new User(newUserData)
      
      try {
        await user.save()
        
       
        const newUserToken = jwt.sign({
          email : user.email,
          firstName : user.firstName,
          lastName : user.lastName,
          isBlocked : user.isBlocked,
          type : user.type,
          profilePicture : user.profilePicture
        }, process.env.SECRET)
        
        res.json({
          message: "User created and logged in",
          token: newUserToken,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.type,
            profilePicture: user.profilePicture,
            email: user.email
          }
        })
      } catch(error) {
        console.error("Error creating user:", error)
        res.status(500).json({      
          message: "User not created",
          error: error.message
        })
      }
    }

  } catch(e) {
    console.error("Google login error:", e)
    res.status(500).json({
      message: "Google login failed",
      error: e.message
    })
  }
}



//1051350535267-o0t5kgkn2qb2eb67k4r2q2flo9d89v4s.apps.googleusercontent.com
//https://www.googleapis.com/auth/userinfo