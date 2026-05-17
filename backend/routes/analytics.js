const express=require("express");
const skillprogress=require('../controllers/skillprogress');
const progressweekly=require("../controllers/progressweekly");
const consistency=require("../controllers/consistency-score");
const authmiddleware=require("../middleware/auth-middleware");
const inconsistencyGateMiddleware = require("../middleware/inconsistency-gate-middleware");
const weakarea=require("../controllers/weak-area");

const analytics=express.Router();

analytics.get('/progressskill',authmiddleware,inconsistencyGateMiddleware,skillprogress);
analytics.get('/progressweekly',authmiddleware,inconsistencyGateMiddleware,progressweekly);
analytics.get("/consistency",authmiddleware,inconsistencyGateMiddleware,consistency);
analytics.get("/weakarea",authmiddleware,inconsistencyGateMiddleware,weakarea);

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
