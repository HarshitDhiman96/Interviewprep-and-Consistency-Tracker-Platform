const express=require('express');
const progressweekly=require("../controllers/progressweekly");
const authMiddleware = require('../middleware/auth-middleware');

const progress=express.Router();

progress.get('/progress',authMiddleware,progressweekly);

module.exports=progress;