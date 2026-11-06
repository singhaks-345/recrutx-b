const express=require("express")
const recruiterRoute=express.Router()
const {recruiterTable} =require('../models/recruiterModel');
const {jobPostTable}=require('../models/jobpost');
recruiterRoute.post("/recruiter-register",async(req,res)=>{
  const name=req.body.name;
  const email=req.body.email;
  const contact=req.body.contact;
  const password=req.body.password;
  const location=req.body.location;
  let logo=req.files.logo;
    logo.mv("uploads/"+logo.name,(err)=>{
        if(err){
            res.send(err)
        }
    })
    console.log("REQ BODY:", req.body);
console.log("REQ FILES:", req.files);

   const data=  new recruiterTable({name: name,email:email,contact:contact,password:password,location:location,logo:logo.name})
   const result= await data.save()
       res.json({
        code :200,
        data:result
       })
})
recruiterRoute.post("/recruiter-login", async (req, res) => {
    const {email,password}=req.body
    
    
          const result = await recruiterTable.findOne({email,password}); 
          if(result) {
          res.json({
            code: 200,
            message: "Login Successfull !...",
            data:result
          });
        } else {
          res.json({
            code: 404,
            message: "Invalid Email or Password"
        
          });
        }
      });

 recruiterRoute.post("/recruiter-jobpost",async(req,res)=>{
  try{
    const {companyId,category,jobTitle,experience,jobType,vacancies,jobLocation,salary,applyDate}=req.body;
  const data= new  jobPostTable({companyId,category,jobTitle,experience,jobType,vacancies,jobLocation,salary,applyDate })
  const result=await data.save();
  res.json({
    code:200,
    message:"Job posted successfull..",
    data:result
  })

  }catch(err){
    console.log(err);
  }    
 })     

 module.exports={recruiterRoute}