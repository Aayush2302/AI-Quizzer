import authRoutes from './routes/auth.routes.js';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cookieParser());

app.use(cors());
app.use(express.json());
dotenv.config();

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Conntected to MongoDB");

    
}).catch((err)=>{
    console.log("Error in connecting to MongoDB",err);
})

export default app;