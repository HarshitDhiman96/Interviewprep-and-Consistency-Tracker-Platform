const express=require("express");
const consistency=require("../controllers/consistency-score");
const authMiddleware = require("../middleware/auth-middleware");
const inconsistencyGateMiddleware = require("../middleware/inconsistency-gate-middleware");

const consistencyscore=express.Router();

consistencyscore.get("/consistency",authMiddleware,inconsistencyGateMiddleware,consistency);

module.exports=consistencyscore;
