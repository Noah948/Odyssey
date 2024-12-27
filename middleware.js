const listing=require("./models/listing.js")
const Review = require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
        {
        req.session.redirectUrl=req.originalUrl;
          req.flash("error","You must login to use these functionalities");
          return res.redirect("/login")
        }
        next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.checkOwner=async(req,res,next)=>{
    let{id}=req.params;
    let list=await listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","Only the Owner Can Perform This Action")
      return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.checkAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","Only the Owner Can Perform This Action")
      return res.redirect(`/listings/${id}`);
    }
    next();
}