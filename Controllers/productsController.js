const Products=require('../models/productsModel');
const asyncErrorHandler=require('./../utils/asyncErrorHandler')
const jwt=require('jsonwebtoken');
const CustomError = require('./../utils/customError');
const ApiFeatures=require('./../utils/ApiFeatures')
const fs = require('fs');

// ✅ Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products
    });
  });
  
  // ✅ Get Product By ID
  exports.getProductById = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(new CustomError("Product not found", 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: product
    });
  });
  
  // ✅ Import Products into DB
  exports.importProducts = asyncErrorHandler(async (req, res, next) => {
    const productsData = require('../data/products.json'); // Create this file with your product data
    await Product.insertMany(productsData);
    
    res.status(201).json({
      status: 'success',
      message: 'Products imported successfully'
    });
  });