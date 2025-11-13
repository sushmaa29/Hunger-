import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'



const createToken=(id)=>{

    // here we have used the user id as data and generate one token 
    return jwt.sign({id},process.env.JWT_SECRET); // return the token 
}

// will login user 
const loginUser=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});

        // if email is not in the database then 
        if(!user){
            return res.json({success:false,message:"User Doesn't exist"});
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"});
        }

        const token=createToken(user._id);
        res.json({success:true,token});

    }
    catch(error){

        console.log(error);
        res.json({success:false,message:"Error"});


    }
}   



// register user 
const registerUser=async(req,res)=>{
    // now we first destructure the body 
    const {name,password,email}=req.body;
    try{
     // we are checking the user if it already exist or not 
     const already_exist=await userModel.findOne({email});
     if(already_exist){
        return res.json({success:false,message:"User already exist "});
     }

     // validating the email format & strong password 
     if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter valid email"})
     }

     // check password lenght is greater the 8 digit or not 
     if(password.length<8){
        return res.json({success:false,message:"password too short"});
     }

     // hashing the user password 
     const salt=await bcrypt.genSalt(10);
     const hashedPassword=await bcrypt.hash(password,salt);



     // creta new user 
     const newUser=new userModel({
        name:name,
        email:email,
        password:hashedPassword,

     })

     // save the user in the database  and take that saved in user 
    const user= await newUser.save();


    // creat one token 
     const token=createToken(user._id);
     res.json({success:true,token});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}



export {loginUser,registerUser};