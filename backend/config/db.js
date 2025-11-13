import mongoose from "mongoose";


export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://mdshaheerrafeeq:mdshaheer123@cluster0.ut2jzz7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{console.log("Hurray DB Connected!")});
}                           

