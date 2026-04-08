const express=require("express");
const skillprogress=require('../controllers/skillprogress');
const progressweekly=require("../controllers/progressweekly");
const consistency=require("../controllers/consistency-score");
const authmiddleware=require("../middleware/auth-middleware");
const weakarea=require("../controllers/weak-area");

const analytics=express.Router();

analytics.get('/progressskill',authmiddleware,skillprogress);
analytics.get('/progressweekly',authmiddleware,progressweekly);
analytics.get("/consistency",authmiddleware,consistency);
analytics.get("/weakarea",authmiddleware,weakarea);

// Heatmap optional auth - pass through middleware if token exists, but not fail if it doesn't
const optionalAuth = (req, res, next) => {
  authmiddleware(req, res, (err) => {
    // ignore strictly failing
    next();
  });
};

const { saveClick, getHeatmap } = require('../controllers/heat-map-controller');
analytics.post("/click", optionalAuth, saveClick);
analytics.get("/heatmap", getHeatmap);

module.exports=analytics;
