import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from 'stripe'


const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);



// placing user order from frontend 
const placeOrder=async(req,res)=>{
    const frontend_url="https://food-circuit-frontend.onrender.com";


    try{
        // creating new order object 
        const newOrder=new orderModel({
            // user id we will get fron the middleware token decode 
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address

        });

        // save this order in database 
        await newOrder.save();

        // clear the cart data 
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});


        // for items necessary for the stripe payment 
        const line_items=req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*80,
            },
            quantity:item.quantity
        }))


        // for delivery charge 
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80,
            },
            quantity:1
        })



        const session=await stripe.checkout.sessions.create({
                line_items:line_items,
                mode:'payment',
                success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true,session_url:session.url})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


const verifyOrder=async(req,res)=>{
    const {orderId,success}=req.body;
    try{
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"paid"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


// user orders for frontend 

const userOrders=async(req,res)=>{
        try{
            const orders=await orderModel.find({userId:req.body.userId});
            res.json({success:true,data:orders});
        }   
        catch(error){
            console.log(error);
            res.json({success:false,message:"Error"});
        }
}


// we want in our admin panel list of all the orders 
const listOrders=async(req,res)=>{
    try{
        // get all the orders in this orders 
        const orders=await orderModel.find({});

        res.json({success:true,data:orders});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


// this api  is for updating the status of the orders status 
const updateStatus=async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Updated"});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});

    }
}



export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus};
