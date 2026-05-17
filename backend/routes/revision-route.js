const express=require("express");
const authMiddleware = require("../middleware/auth-middleware");
const inconsistencyGateMiddleware = require("../middleware/inconsistency-gate-middleware");
const {addRevision,getRevisions,deleteRevision}=require("../controllers/revision-contoller");
const revsionrouter=express.Router();

revsionrouter.post("/add", authMiddleware, inconsistencyGateMiddleware, addRevision);
revsionrouter.get("/fetch", authMiddleware, inconsistencyGateMiddleware, getRevisions);
revsionrouter.delete("/:revisionId", authMiddleware, inconsistencyGateMiddleware, deleteRevision);

module.exports=revsionrouter;
