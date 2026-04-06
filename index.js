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
const { isOriginAllowed } = require('./utils/cors-utils');

const app=express();

const corsMiddleware = (req, res, next) => {
    const requestOrigin = req.headers.origin;

    if (!requestOrigin) {
        return next();
    }

    if (isOriginAllowed(requestOrigin)) {
        res.header("Access-Control-Allow-Origin", requestOrigin);
        res.header("Vary", "Origin");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
};

//database
db.connection();

//middleware
app.use(corsMiddleware);
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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
