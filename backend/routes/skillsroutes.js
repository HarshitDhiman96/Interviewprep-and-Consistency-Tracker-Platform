const express=require('express')
const {addskill,deleteskill,fetchskill}=require('../controllers/skills-controller')
const authMiddleware=require('../middleware/auth-middleware')
const inconsistencyGateMiddleware = require('../middleware/inconsistency-gate-middleware')


const skillsroutes=express.Router()


skillsroutes.post('/add',authMiddleware,inconsistencyGateMiddleware,addskill)
skillsroutes.get('/fetch',authMiddleware,inconsistencyGateMiddleware,fetchskill)
skillsroutes.post('/delete/:skillId',authMiddleware,inconsistencyGateMiddleware,deleteskill)

module.exports=skillsroutes
