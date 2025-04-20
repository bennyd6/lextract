import express from "express";
import 'dotenv/config'
import connectDB from "./db.js"
import cors from "cors"
import authRoutes from "./routes/authRouters.js";


const app=express();
const port=3000;
app.use(express.json()); 
app.use(cors());


 connectDB();
 
// const connectUrl=process.env.mongoUrl;
app.use("/api/auth", authRoutes);
app.listen(port,()=>
{
    console.log(`Server is running at ${port}`);
})