const express=require('express')
const authMiddleware = require('../middleware/auth-middleware')
const inconsistencyGateMiddleware = require('../middleware/inconsistency-gate-middleware')
const {register,login,changepassword,me,logout,updateRememberPreference}=require('../controllers/auth-controller')

const routes=express.Router();

routes.post('/login',login)
routes.post('/register',register)
routes.post('/changepassword',changepassword)
routes.post('/logout',logout)
routes.get('/me',authMiddleware,me)
routes.post('/remember-me',authMiddleware,inconsistencyGateMiddleware,updateRememberPreference)

module.exports= routes
