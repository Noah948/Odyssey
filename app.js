if(process.env.NODE_ENV!="production")
{
require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const path=require("path");
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
app.use(methodOverride('_method'));
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");
const store=MongoStore.create({
    mongoUrl:process.env.ATLAS,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("ERROR in Mongo Session",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true
    }
}

app.get("/",(req,res)=>{
    res.send("root path");
})
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
async function main() {
   mongoose.connect(process.env.ATLAS); 
}
main().then(()=>{
    console.log("connection established with db");

})
.catch((err)=>{
    console.log(err);
})
app.listen(8080,()=>{
    console.log("8080 is working");
})



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);

   
    


  
