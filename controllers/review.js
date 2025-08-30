const Listing=require("../models/listing");
const Review= require("../models/reviews");

module.exports.createReview=async (req, res) => {
  console.log("FULL BODY:", req.body);  
  console.log("REVIEW OBJECT:", req.body.review); 
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author=req.user._id;
 
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();

  console.log("new review save", newReview);
  req.flash("success", "New Review Added");
  res.redirect( `/listings/${listing._id}`);

}

module.exports.destroyReview=async(req,res)=>{
    let{id ,reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", " Review deleted")
    res.redirect(`/listings/${id}`);
  }