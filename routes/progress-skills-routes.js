const express=require('express');
const skillprogress=require('../controllers/skillprogress');
const authMiddleware = require('../middleware/auth-middleware');

const progressskill=express.Router();

progressskill.get('/progressskill',authMiddleware,skillprogress);

module.exports=progressskill;