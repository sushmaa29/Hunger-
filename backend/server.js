import express from "express"
import cors from "cors"
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";









// app config 

const app=express();
const port=process.env.PORT||4000;


// add middleware 
app.use(express.json()); // using this middle ware whenever we get the request from the forntend to backend that will be parsed using this JSON
app.use(cors()); // using this we can acess the backend from any frontend 



// db connection 
connectDB();





//api endpoints 
app.use("/api/food",foodRouter);
app.use("/api/user",userRouter);

// this endping will help to acess the images with their names
app.use('/images',express.static('uploads'));

// this is for the cart function 
app.use('/api/cart',cartRouter);


// this is for place order 
app.use('/api/order',orderRouter);

app.get('/',(req,res)=>{
    res.send("api working ");
})






// run the express server 

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`);
})


