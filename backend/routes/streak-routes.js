const express=require('express');
const authmiddleware=require('../middleware/auth-middleware')
const streakcontroller=require('../controllers/streak-controller')

const streakroutes=express.Router();

streakroutes.get('/fetch',authmiddleware,streakcontroller);

module.exports=streakroutes;

