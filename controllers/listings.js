const listing = require("../models/listing.js");
const { isLoggedIn, checkOwner } = require("../middleware.js");

module.exports.index = async (req, res) => {
  try {
    const list = await listing.find({});
    res.render("listings/index.ejs", { list });
  } catch (err) {
    console.error("Error fetching listings:", JSON.stringify(err, null, 2));
    req.flash("error", "Unable to fetch listings");
    res.redirect("/");
  }
};

module.exports.new = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.listingCreation = async (req, res) => {
  try {
    if (!req.file) {
      req.flash("error", "No file uploaded!");
      return res.redirect("/listings/new");
    }

    const { path: url, filename: fileName } = req.file;
    const newDetail = new listing({
      ...req.body,
      owner: req.user._id,
      image: { url, fileName },
    });

    await newDetail.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", JSON.stringify(err, null, 2));
    req.flash("error", "Error creating listing");
    res.redirect("/listings/new");
  }
};

module.exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await listing
      .findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!list) {
      req.flash("error", "Listing you are trying to reach does not exist");
      return res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { list });
  } catch (err) {
    console.error("Error fetching listing:", JSON.stringify(err, null, 2));
    req.flash("error", "Error fetching the listing");
    res.redirect("/listings");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await listing.findById(id);

    if (!list) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    let compressedImage = list.image.url.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { list, compressedImage });
  } catch (err) {
    console.error("Error fetching listing for edit:", JSON.stringify(err, null, 2));
    req.flash("error", "Error fetching the listing");
    res.redirect("/listings");
  }
};

module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const listUpdate = await listing.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true } // Return the updated document
    );

    if (!listUpdate) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    if (req.file) {
      const { path: url, filename: fileName } = req.file;
      listUpdate.image = { url, fileName };
      await listUpdate.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", JSON.stringify(err, null, 2));
    req.flash("error", "Error updating the listing");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedListing = await listing.findByIdAndDelete(id);

    if (!deletedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error deleting listing:", JSON.stringify(err, null, 2));
    req.flash("error", "Error deleting the listing");
    res.redirect("/listings");
  }
};
