import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item ,
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  // create a new food
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    // food.save() will save new data food in database
    await food.save();
    console.log("bhai placed hai yaar");
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// get all the food items from the database
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

// remove food item

const removeFood = async (req, res) => {
  try {
    // find the food item form the database
    const food = await foodModel.findById(req.body.id);
    // delete the image form our upload folder
    if (food.image !== null) fs.unlink(`uploads/${food.image}`, () => {});

    // delete the data form the mongoBD database
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed " });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
