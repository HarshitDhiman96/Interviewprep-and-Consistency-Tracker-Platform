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
    const loginuser = await user.findOne({ $or: [{ email: email }, { name: email }] });
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
    const {email, oldpassword, newpassword}=req.body;

    if(!email || !oldpassword || !newpassword){
      return res.status(400).json({
        success:false,
        message:"email, old password and new password are all required"
      })
    }

    // Find the user by email
    const finduser=await user.findOne({email})
    if(!finduser){
      return res.status(404).json({
        success:false,
        message:"No account found with this email address"
      })
    }

    // Verify the old password is correct
    const isOldPasswordValid = await bcrypt.compare(oldpassword, finduser.password)
    if(!isOldPasswordValid){
      return res.status(401).json({
        success:false,
        message:"Old password is incorrect"
      })
    }

    // Ensure new password is different from old one
    const isSamePassword = await bcrypt.compare(newpassword, finduser.password)
    if(isSamePassword){
      return res.status(400).json({
        success:false,
        message:"New password cannot be the same as the old password"
      })
    }

    // Hash and save the new password
    const salt = await bcrypt.genSalt(10);
    const hashednewpsswd = await bcrypt.hash(newpassword, salt);
    finduser.password = hashednewpsswd;
    await finduser.save();

    return res.status(200).json({
      success:true,
      message:"Password changed successfully"
    })

  }catch(e){
    console.error("error while changing password ",e);
    return res.status(500).json({
      success:false,
      message:"Internal server error. Please try again later."
    })
  }
}

module.exports={register,login,changepassword}