const mongoose=require('mongoose')

const connection=async()=>{
    try{
        await mongoose.connect(process.env.mongooseurl)
        console.log("connection with dbs success")
    }
    catch(e){
        console.log("error while connecting database");
        process.exit(1);
    }
}
module.exports={connection}