import mongoose from "mongoose";



// this is the schema of the food items 
const foodSchema= new mongoose.Schema({
    name: {type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true}
})



// here one important point is take care of is the model not creted again so that || is used if it is exits already then it will not created again
const foodModel=mongoose.models.food||mongoose.model("food",foodSchema);


export default foodModel;
