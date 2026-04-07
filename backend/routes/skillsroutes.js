const express=require('express')
const {addskill,deleteskill,fetchskill}=require('../controllers/skills-controller')
const authMiddleware=require('../middleware/auth-middleware')


const skillsroutes=express.Router()


skillsroutes.post('/add',authMiddleware,addskill)
skillsroutes.get('/fetch',authMiddleware,fetchskill)
skillsroutes.post('/delete/:skillId',authMiddleware,deleteskill)

module.exports=skillsroutes