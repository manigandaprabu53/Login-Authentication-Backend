import express from "express";
import userRoutes from './user.routes.js';

const router = express.Router();

router.use('/users', userRoutes)

router.get('*', (req, res)=>{`<div style="text-align:center"><h1>404 NOT FOUND</h1><p>The requested URL endpoint doesn't exist</p></div>`})

export default router;