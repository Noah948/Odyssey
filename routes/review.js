const express=require("express");
const router=express.Router({mergeParams:true});
const reviewController=require("../controllers/reviews.js")
const {isLoggedIn,saveRedirectUrl,checkAuthor}=require("../middleware.js");
router.post("/",isLoggedIn,reviewController.postReview)
router.delete("/:reviewId", isLoggedIn,checkAuthor,reviewController.deleteReview)
module.exports=router;