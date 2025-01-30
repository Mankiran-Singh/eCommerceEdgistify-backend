const User=require('./../models/UserModel');
const asyncErrorHandler=require('./../utils/asyncErrorHandler')
const jwt=require('jsonwebtoken');
const CustomError = require('./../utils/customError');

// const util=require('util');

const signToken=id=>{
   return jwt.sign({id},process.env.SECRET_STR,{
      expiresIn:process.env.LOGIN_EXPIRES
  })
}
//Sign Up
exports.signup=asyncErrorHandler(async (req,res,next)=>{
   const newUser=await User.create(req.body);
   const token=signToken(newUser._id)
   //token
   res.status(201).json({
      status:'success',
      data:{
        token,
        user:newUser
      }
   });
})

exports.login = asyncErrorHandler(async (req, res, next) => {
   const email=req.body.email;
   const password=req.body.password;
   //const {email,password}=req.body object destructuring syntax
   //Check if email and password is present in request body
   if(!email || !password){
      const error=new CustomError("Please provide email and password for logging in",400);
      return next(error);
   }
   //Check if user exists in the database or not
   const user=await User.findOne({ email }).select('+password');

   
   //Check if user exists & password matches
   if(!user || !(await user.comparePasswordInDB(password,user.password))){
      const error=new CustomError("Correct email or password",404)
      return  next(error);
   }
 
   // Generate Token
   const token = signToken(user._id);
   console.log(token)
   // Store token in httpOnly Cookie
   res.cookie('jwt', token, {
     httpOnly: true, 
     secure: process.env.NODE_ENV === 'development', 
     maxAge: 60 * 60 * 1000 // 1 hour
   });
 
   res.status(200).json({
     status: 'success',
     user: { id: user._id, fullName: user.fullName, email: user.email }
   });
 });
 
 // ✅ Check if user is authenticated
 exports.checkAuth = asyncErrorHandler(async (req, res, next) => {
   const token = req.cookies.jwt;
   if (!token) {
     return res.status(401).json({ message: 'Not Authenticated' });
   }
 
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   const user = await User.findById(decoded.id);
   if (!user) {
     return res.status(401).json({ message: 'User not found' });
   }
 
   res.status(200).json({ user: { id: user._id, fullName: user.fullName, email: user.email } });
 });
 
 // ✅ Logout and Remove Token
 exports.logout = asyncErrorHandler(async (req, res, next) => {
   res.clearCookie('jwt');
   res.status(200).json({ message: 'Logged out successfully' });
 });