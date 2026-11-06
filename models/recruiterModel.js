const mongoose=require("mongoose");
  let RecruiterSchema=new mongoose.Schema({

    name:{type:String,required:true},
    logo:{type:String,required:true},
    email:{type:String,required:true},
    contact:{type:Number,required:true},
    password:{type:String,required:true},
    location:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()}

  })

   const recruiterTable= mongoose.model("recruiters",RecruiterSchema);
   module.exports={recruiterTable}