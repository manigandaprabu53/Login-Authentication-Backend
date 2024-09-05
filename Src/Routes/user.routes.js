import express from "express";
import userController from "../Controller/user.controller.js";

const router = express.Router();

router.post('/createUser', userController.createUser)
router.post('/forgotPassword', userController.forgotPassword)
router.post('/loginUser', userController.loginUser)
router.post('/resetPassword/:token', userController.resetPassword)

export default router;