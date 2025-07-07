import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config()

export function createUser(req, res) {
    // 1. Get the user data from the request body
    const userData = req.body;

    // 2. Hash the password
    userData.password = bcrypt.hashSync(userData.password, 10);

    // 3. Create a new User instance with the object
    const user = new User(userData);

    // 4. Save the user
    user.save().then(
        () => res.json({
            message: "user Created"
        })
    ).catch(
        (error) => {
            res.json({
                message: "user not Created"
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
                        token: token
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

