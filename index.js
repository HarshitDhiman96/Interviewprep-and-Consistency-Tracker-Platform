require('dotenv').config();
const express=require('express')
const routes=require("./routes/auth-routes")
const skillsroutes=require("./routes/skillsroutes")
const logroutes=require('./routes/log-routes')
const db=require('./database/db')

const app=express();

//database
db.connection();

//middleware
app.use(express.json());

//routes
app.get("/",(req,res)=>{
    res.json("Home Page with basic route")
})
app.use("/api/auth",routes);
app.use("/api/skills",skillsroutes);
app.use("/api/log",logroutes)

const port=process.env.port
app.listen(port,()=>{
    console.log(`port is running at ${port}`);
})
