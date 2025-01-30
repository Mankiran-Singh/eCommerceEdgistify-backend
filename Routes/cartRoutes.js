const express=require('express');
const cartController=require('./../Controllers/cartController')
const router=express.Router();

router.route('/add').post(cartController.addToCart);
router.route('/:userId').get(cartController.getCart);
router.route('/placeOrder').post(cartController.placeOrder);
router.route('/placedOrders/:userId').get(cartController.getPlacedOrders);

module.exports=router;