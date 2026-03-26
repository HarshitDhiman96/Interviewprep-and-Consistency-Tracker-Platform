const express=require("express");
const skillprogress=require('../controllers/skillprogress');
const progressweekly=require("../controllers/progressweekly");
const consistency=require("../controllers/consistency-score");
const authmiddleware=require("../middleware/auth-middleware");
const weakarea=require("../controllers/weak-area");

const analytics=express.Router();

analytics.get('/progressskill',authmiddleware,skillprogress);
analytics.get('/progressweekly',authmiddleware,progressweekly);
analytics.get("/consistency",authmiddleware,consistency);
analytics.get("/weakarea",authmiddleware,weakarea);

module.exports=analytics;