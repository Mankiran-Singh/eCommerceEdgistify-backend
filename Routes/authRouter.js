const express=require('express');
const authController=require('./../Controllers/authController');
const router=express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/check-auth').get(authController.checkAuth);

module.exports=router;