const listing=require("../models/listing.js")
const {isLoggedIn,checkOwner}=require("../middleware.js");
module.exports.index=async (req,res)=>{
    const list=await listing.find({});
    res.render("listings/index.ejs",{list});
}
module.exports.new=(req,res)=>{
    res.render("./listings/new.ejs");
}
module.exports.listingCreation=(req,res)=>{
   let url=req.file.path;
   let fileName=req.file.filename;
    let newDetail = new listing({ ...req.body });
    newDetail.owner=req.user._id;
    newDetail.image={url,fileName}
    newDetail.save().then((res)=>{ })
        .catch(err => console.log(err));
      req.flash("success","New Listing Created!"); 
     res.redirect("/listings")    
}
module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const list=await listing.findById(id).populate({path:'reviews',populate:{path:"author",}}).populate("owner");
    if(!list){
      res.redirect("/listings");
      req.flash("error","Listing you are trying to reach does not exist"); 
    }
    res.render("./listings/show.ejs",{list});
}
module.exports.edit=async(req,res)=>{
    let{id}=req.params;
    let list=await listing.findById(id);
    let compressedImage=list.image.url;
    compressedImage = compressedImage.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs",{list,compressedImage});
  }
  module.exports.update=async (req,res)=>{
   
    let {id}=req.params;
     // Spread the request body into an object
  
const listUpdate = await listing.findByIdAndUpdate(
    id,
    { ...req.body }, // Pass the updated data directly
);
if(typeof req.file!=="undefined")
{
let url=req.file.path;
let fileName=req.file.filename;
listUpdate.image={url,fileName};
await listUpdate.save();
}
    req.flash("success","Listing Updated!"); 
    res.redirect(`/listings/${id}`);
  }
  module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted"); 
    res.redirect("/listings");
  }