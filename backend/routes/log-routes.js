const express=require('express')
const authmiddleware=require('../middleware/auth-middleware')
const inconsistencyGateMiddleware = require('../middleware/inconsistency-gate-middleware')
const {addlog,dailylog,weeklog,filterbyskills,getalllogs}=require('../controllers/log-controller')


const logroutes=express.Router()

logroutes.post('/add',authmiddleware,inconsistencyGateMiddleware,addlog)
logroutes.get('/filterbyskills',authmiddleware,inconsistencyGateMiddleware,filterbyskills)
logroutes.post('/weeklog',authmiddleware,inconsistencyGateMiddleware,weeklog)
logroutes.post('/dailylog',authmiddleware,inconsistencyGateMiddleware,dailylog)
logroutes.get('/all',authmiddleware,inconsistencyGateMiddleware,getalllogs)

module.exports =logroutes;
