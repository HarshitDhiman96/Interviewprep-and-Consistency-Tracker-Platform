const express=require('express');
const skillprogress=require('../controllers/skillprogress');
const authMiddleware = require('../middleware/auth-middleware');
const inconsistencyGateMiddleware = require('../middleware/inconsistency-gate-middleware');

const progressskill=express.Router();

progressskill.get('/progressskill',authMiddleware,inconsistencyGateMiddleware,skillprogress);

module.exports=progressskill;
