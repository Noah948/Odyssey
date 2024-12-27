const express=require("express");
const router=express.Router();
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })
const {isLoggedIn,checkOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
router.route("/").get(listingController.index).post(isLoggedIn,upload.single("image"),listingController.listingCreation)
router.get("/new",isLoggedIn,listingController.new)
router.route("/:id").get(listingController.show).put(upload.single("image"),listingController.update).delete(isLoggedIn,checkOwner,listingController.delete)
router.get("/:id/edit",isLoggedIn,checkOwner,listingController.edit)
  module.exports=router;