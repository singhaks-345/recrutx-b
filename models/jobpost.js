const mongoose=require("mongoose");
  let jobPostSchema=new mongoose.Schema({
    companyId:{type:String},  
    category:{type:String,required:true},
    jobTitle:{type:String},
    experience:{type:String},
    jobType:{type:String},
    vacancies :{type:String},
    jobLocation :{type:String},
    salary :{type:String},
    applyDate :{type:String},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()}

  })
   const jobPostTable= mongoose.model("jobPosts",jobPostSchema);
   module.exports={jobPostTable}