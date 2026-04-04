require('dotenv').config();
const express=require('express')
const cookieParser = require("cookie-parser");
const routes=require("./routes/auth-routes")
const skillsroutes=require("./routes/skillsroutes")
const logroutes=require('./routes/log-routes')
const db=require('./database/db');
const streakroutes = require('./routes/streak-routes');
 //const heatmap=require("./controllers/heat-map-controller");
const authMiddleware = require('./middleware/auth-middleware');
const analytics=require("./routes/analytics");
const revision=require("./routes/revision-route");


const app=express();

//database
db.connection();

//middleware
app.use(express.json());
app.use(cookieParser());

//routes
app.get("/",(req,res)=>{
    res.json("Home Page with basic route")
})
app.use("/api/auth",routes);
app.use("/api/skills",skillsroutes);
app.use("/api/log",logroutes)
app.use("/api/streak",streakroutes)
app.use("/api/analytics",analytics);
app.use('/api/revision',revision);

 //app.get("/api/analytics/heatmap",authMiddleware,heatmap);  

const port=process.env.port
app.listen(port,()=>{
    console.log(`port is running at ${port}`);
})
