const mongoose=require('mongoose');
const validator=require('validator');

const productSchema = new mongoose.Schema({
    price: {
      type: Number,
      required: [true, "Please enter the price of the product"]
    },
    description: {
      type: String,
      required: [true, "Please enter a description of the product"]
    },
    brand: {
      type: String,
      required: [true, "Enter the brand of the product"]
    },
    name: {
      type: String,
      required: [true, "Please enter the product name"]
    },
    detail: {
      type: String,
      required: [true, "Enter product details"]
    },
    quantity: {
      type: Number,
      required: [true, "Enter product quantity"]
    },
    image: {
      type: String,
      required: [true, "Please provide a product image URL"]
    }
  });

const products=mongoose.model('products',productSchema)
module.exports=products;