const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
  fullName:{
    type:String,
    required:[true,"Please enter name"]
  },
  email:{
     type:String,
     required:[true,"Please enter an email"],
     unique:true,
     lowerCase:true,
     validate:[validator.isEmail,"Please enter a valid email"]
  },
  password:{
    type:String,
    required:[true,"Please enter a password"],
    minLength:8,
    select:false //we don't want to return it in res while logging in 
  }
})

userSchema.pre('save',async function(next){
    //encryption is also called as hashing
   //before saving it in database we want to encrypt the password

   this.password=await bcrypt.hash(this.password,12);
   next();//cost=12=how cpu intensive this operation will be
})

userSchema.methods.comparePasswordInDB=async function(password,passwordDB){
   return await bcrypt.compare(password,passwordDB)
}

const User=mongoose.model('User',userSchema)
module.exports=User;