const mongoose=require("mongoose");
const initda=require("./intialize.js")
const listing=require("../models/listing.js")
async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wanderer"); 
 }
 main().then(()=>{
     console.log("connection established with db");
 
 })
 .catch((err)=>{
     console.log(err);
 })
 const initDB=async()=>{
    await listing.deleteMany({});
    initda.data=initda.data.map((obj)=>({ ...obj, owner:'6763f84542edd1fb80799d51',}));
    await listing.insertMany(initda.data)
 }
 initDB();