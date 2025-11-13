import express from 'express';
import { addFood,listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';


// multer is used to create image storage system 

// this is the router using this router we can do any method requent like "get, post ,delete , updata "
const foodRouter=express.Router();






// here we will create a logic for image that will be stored in upload folder 
const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})


const upload=multer({storage:storage});



// we use this to send the data on the server , on the sever our data will be proces
// and after that we will get one response 
// for example the form we submit its a post method 
// to add food in our database 
foodRouter.post("/add",upload.single("image"),addFood)



// get the food items form the database 
foodRouter.get('/list',listFood);


// to remove a food item form the food list 
foodRouter.post('/remove',removeFood);


export default foodRouter;