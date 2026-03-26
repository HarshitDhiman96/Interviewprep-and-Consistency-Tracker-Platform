const express=require("express");
const authMiddleware = require("../middleware/auth-middleware");
const {addRevision,getRevisions}=require("../controllers/revision-contoller");
const revsionrouter=express.Router();

revsionrouter.post("/add", authMiddleware, addRevision);
revsionrouter.get("/fetch", authMiddleware, getRevisions);

module.exports=revsionrouter;