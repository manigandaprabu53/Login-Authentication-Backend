import 'dotenv/config';
import userModel from '../Model/user.js';
import auth from '../Utils/auth.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer'
import user from '../Model/user.js';

const createUser = async(req, res)=>{
    try {
        let user = await userModel.findOne({email: req.body.email});

        if(!user){
            req.body.password = await auth.hashData(req.body.password);
            await userModel.create(req.body)
            res.status(200).send({message: "User Created SuccessFully"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}

const loginUser = async(req, res)=>{
    try {
        let {email, password} = req.body;
        let user = await userModel.findOne({email: email});
        if(user){
            if(await auth.compareHash(user.password, password)){
                const token = auth.createToken({
                    name: user.name,
                    email: user.email,
                    id: user.id
                })

                res.status(200).send({message: "User Login Successfull", token: token})
            }
            else{
                res.status(401).send({message: "Unauthorized User"})
            }
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}

const forgotPassword = async(req, res)=>{
    try {
        const user = await userModel.findOne({email: req.body.email});
        if(!user){
            res.status(400).send({message: "User Not Found"})
        }else{
            user.random = crypto.randomBytes(10).toString('hex');
            user.tokenExpiry = Date.now()+600000;
            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {user: 'manigandaprabumani96271@gmail.com', pass: 'jkta zqzx gsyt dxzg'}
            });

            const mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n http://localhost:5173/resetPassword/${user.random}\n\n  If you did not request this, please ignore this email and your password will remain unchanged.\n`
            }

            transporter.sendMail(mailOptions, (err)=>{
                if(err){
                    return res.status(500).send({message: "Error Sending Mail", err})
                }
                else{
                    res.status(200).send({message: "Password Reset Mail Sent"})
                }
            })
            // res.status(200).send({message: "Password Reset Token Generated"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || "Internal Server Error"})
    }
}

const resetPassword = async(req, res)=>{
    try {
        console.log("Password Reset Block")
        let token = req.params.token;
        console.log(req.params.token+"pppppppppppppppppp")
        console.log(req.body.password+"xxxxxxxxxxxxx")
        const user = await userModel.findOne({random: token, tokenExpiry: {$gt: Date.now()}})

        if (!user) return res.status(400).send({message: 'Password reset token is invalid or has expired'});
        console.log(req.body.password)
        user.password = await auth.hashData(req.body.password);
        user.random = null;
        user.tokenExpiry = null;
        user.save();

        res.status(200).send({message: "Password Has Been Reset"})
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || "Internal Server Error"})
    }
}

export default {
    createUser,
    loginUser,
    forgotPassword,
    resetPassword
}

