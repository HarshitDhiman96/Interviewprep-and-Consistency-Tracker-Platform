const express=require('express')
const {register,login,changepassword}=require('../controllers/auth-controller')

const routes=express.Router();

routes.post('/login',login)
routes.post('/register',register)
routes.post('/changepassword',changepassword)

module.exports= routes