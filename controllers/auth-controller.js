const bcrypt = require('bcrypt')
const jwttoken=require("jsonwebtoken")
const user=require('../models/user-model')

const register=async(req,res)=>{
    try{
        console.log(req.body);
        const{name,email,password,role,skills}=req.body;
        //check uniqueness of email 
        const checkunique=await user.findOne({email});
        if (checkunique){
            res.status(500).json({
                success:false,
            message:"email is already registered please enter other "
            })
        }
        //hashed password
        const salt = await bcrypt.genSalt(10);
            const hashedpsswd = await bcrypt.hash(password, salt);
        
            const newuser = new user({ name, email, password: hashedpsswd, role, skills });
            await newuser.save();
        
            res.status(200).json({ success: true, message: "User registered successfully!" });
    }catch(e){
        console.log("error while registering user ");
        res.status(500).json({
            success:false,
            message:e.message
        }
        )
    }
}

const login = async (req, res) => {
  try {
    // console.log(req.body);
    const{email,password}=req.body;
    const loginuser=await user.findOne({email});
    if(!loginuser){
      return res.status(400).json({
        status:false,
        message:"please register yourself first then try to login in our database"
      })
    }
    else{
      const ispassmatch=await bcrypt.compare(password,loginuser.password);
      if(!ispassmatch){
        return res.status(400).json({
          status:false,
          message:"Invalid password or username"
        });
      }
      //creating jwt token for 30 minutes 
      const accesstoken=jwttoken.sign({
        userid:loginuser._id,
        username:loginuser.name,
        useremail:loginuser.email,
        role:loginuser.role
      },process.env.jwtkey,{
        expiresIn:"2h"
      })
      res.status(200).json({
        success:true,
        message:"login successfully now u have 30 minutes enjoy",
        accesstoken
      })
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "error is here please resolve that error by yourself",
    });
  }
};

const changepassword=async(req,res)=>{
  try{
    const {email,newpassword}=req.body;
    //finds user with that name
    const finduser=await user.findOne({email})
    if(!finduser){
      res.status(401).json({
        success:false,
        message:"email didn't match in dbs"
      })
    }
    else{
      //checks if old psswd is same as new one 
      console.log(req.body,finduser.password)
      const checkps= await bcrypt.compare(newpassword,finduser.password)
      if(checkps){
        res.status(401).json({
          message:"old and new password can't be same "
        })
      }
      else{
        const salt = await bcrypt.genSalt(10);
    const hashednewpsswd = await bcrypt.hash(newpassword, salt);
    finduser.password=hashednewpsswd;
    await finduser.save();
    res.status(200).json({
      messgae:"password changed successfully",
      password:hashednewpsswd
    })
      }
    }

  }catch(e){
    console.error("error while changing password try again later ",e);
  }
}

module.exports={register,login,changepassword}