const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js")
router.route("/signup").get(userController.signUp).post(userController.saveSignUp);
router.route("/login").get(userController.login).post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash:true}),userController.checkLogin);
router.get("/logout",userController.logOut)
module.exports=router;