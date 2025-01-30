const Cart = require('../models/CartModel');
const Product = require('../models/productsModel');
const Order = require('../models/OrderModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/customError');

//  Add to Cart
exports.addToCart = asyncErrorHandler(async (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  console.log(req.body)

  const product = await Product.findById(productId);
  if (!product) return next(new CustomError("Product not found", 404));

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, quantity }] });
  } else {
    const existingProduct = cart.products.find(p => p.productId.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
  }

  await cart.save();
  const updatedCart = await Cart.findOne({ userId })
    .populate('products.productId', 'name price description') // populate specific fields
    .exec();

  res.status(200).json({
    status: "success",
    message: "Product added to cart",
    cart: updatedCart
  });
});

//  Get Cart Items
exports.getCart = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId }).populate('products.productId');

  if (!cart) return next(new CustomError("Cart not found", 404));

  res.status(200).json({ status: "success", cart });
});

//  Place Order
exports.placeOrder = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.body;
  const cart = await Cart.findOne({ userId }).populate('products.productId');

  if (!cart || cart.products.length === 0) {
    return next(new CustomError("Your cart is empty!", 400));
  }

  let totalAmount = 0;
  cart.products.forEach(item => {
    totalAmount += item.productId.price * item.quantity;
  });

  const newOrder = new Order({
    userId,
    products: cart.products,
    totalAmount
  });

  await newOrder.save();
  await Cart.deleteOne({ userId });

  res.status(201).json({ status: "success", message: "Order placed successfully", order: newOrder });
});


//  Get Placed Orders
exports.getPlacedOrders = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req.params;
   console.log(req.params)
    // Find orders placed by the user
    const orders = await Order.find({ userId })
      .populate('products.productId', 'name price description')  // Populate product details
      .exec();
  
    if (orders.length === 0) {
      return next(new CustomError("No orders found for this user", 404));
    }
  
    res.status(200).json({
      status: "success",
      orders
    });
  });
  