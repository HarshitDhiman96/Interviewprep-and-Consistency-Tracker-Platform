const express=require("express");
const consistency=require("../controllers/consistency-score");
const authMiddleware = require("../middleware/auth-middleware");

const consistencyscore=express.Router();

consistencyscore.get("/consistency",authMiddleware,consistency);

module.exports=consistencyscore;