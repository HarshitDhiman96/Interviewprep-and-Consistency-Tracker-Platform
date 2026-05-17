const express=require('express');
const authmiddleware=require('../middleware/auth-middleware')
const inconsistencyGateMiddleware = require('../middleware/inconsistency-gate-middleware')
const streakcontroller=require('../controllers/streak-controller')

const streakroutes=express.Router();

streakroutes.get('/fetch',authmiddleware,inconsistencyGateMiddleware,streakcontroller);

module.exports=streakroutes;

