const express=require('express');
const productsController=require('./../Controllers/productsController')
const authController=require('./../Controllers/authController')
const router=express.Router();

router.route('/').get(productsController.getAllProducts);
router.route('/:id').get(productsController.getProductById);
router.route('/import').post(productsController.importProducts);

module.exports=router;