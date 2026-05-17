const express=require('express');
const progressweekly=require("../controllers/progressweekly");
const authMiddleware = require('../middleware/auth-middleware');
const inconsistencyGateMiddleware = require('../middleware/inconsistency-gate-middleware');

const progress=express.Router();

progress.get('/progress',authMiddleware,inconsistencyGateMiddleware,progressweekly);

module.exports=progress;
