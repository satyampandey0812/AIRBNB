const Listing= require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema_joi");

// index route
module.exports.index=async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing })
}
// new route
module.exports.renderNewForm=async (req, res) => {
  res.render("listings/new.ejs");
}
// show route
module.exports.showListing=async (req, res,next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path:"reviews",
  populate:{
    path:"author",
  },
})
.populate("owner");

   if (!listing) {
     req.flash("error","Listing you requested for doesn't exist!!");
    return res.redirect("/listings");
  }
 
  res.render("listings/show.ejs", { listing });

}
// create listing
module.exports.createListing=async (req, res, next) => {
  let url=req.file.path;
  let filename= req.file.filename;
  console.log(url,"..", filename);
  let result = listingSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }

  let { title, description, image, price, location, country } = req.body;
  let newPlace = new Listing({
    title: title,
    description: description,
    image: image,
    price: price,
    location: location,
    country: country,
  });
  newPlace.owner= req.user._id;
  newPlace.image={url,filename};
  await newPlace.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");

}
// edit listing
module.exports.renderEditForm=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist ");
    res.redirect ("/listings");
  }

  let originalImageUrl= listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250"); 
  res.render("listings/edit.ejs", { listing, originalImageUrl });

}
// update route
module.exports.updateListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id,{ ...req.body});
  console.log(req.body) !=="undefined"
  if(typeof req.file){
    let url=req.file.path;
  let filename= req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
  
  req.flash("success", "Existing Listing updated")
  res.redirect(`/listings/${id}`);

}
// delete listing route 
module.exports.destroyListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id, req.body);
  req.flash("success", " Listing deleted")
  res.redirect("/listings");

}