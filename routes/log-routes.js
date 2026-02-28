const express=require('express')
const authmiddleware=require('../middleware/auth-middleware')
const {addlog,dailylog,weeklog,filterbyskills}=require('../controllers/log-controller')


const logroutes=express.Router()

logroutes.post('/add',authmiddleware,addlog)
logroutes.get('/filterbyskills',authmiddleware,filterbyskills)
logroutes.post('/weeklog',authmiddleware,weeklog)
logroutes.post('/dailylog',authmiddleware,dailylog)

module.exports =logroutes;
