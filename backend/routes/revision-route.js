const express=require("express");
const authMiddleware = require("../middleware/auth-middleware");
const {addRevision,getRevisions,deleteRevision}=require("../controllers/revision-contoller");
const revsionrouter=express.Router();

revsionrouter.post("/add", authMiddleware, addRevision);
revsionrouter.get("/fetch", authMiddleware, getRevisions);
revsionrouter.delete("/:revisionId", authMiddleware, deleteRevision);

module.exports=revsionrouter;
