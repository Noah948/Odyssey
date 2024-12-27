const User=require("../models/user.js");
module.exports.signUp=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.saveSignUp=async(req, res) => {
    try{
    const { name, email, password } = req.body;
    const user = new User({ name, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","User Created Successfully");
    res.redirect("/listings")
    })
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.login=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.checkLogin=  async(req, res)=> {
    req.flash("success","Welcome back");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
  module.exports.logOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You Logged out ")
        res.redirect("/listings");
    })
}