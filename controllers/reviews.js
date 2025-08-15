const Review=require("../model/review.js");
const Listing=require("../model/listing.js")


module.exports.createReview=async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  // const { id } = req.params;
  //   const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

  let newReview = new Review(req.body.review);
  newReview.author =req.user._id;
  console.log(newReview)
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
console.log("new review saved");
 req.flash("success","New Review created!");
res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}})
  await Review.findByIdAndDelete(reviewId);
   req.flash("success","review deleted");
  res.redirect(`/listings/${id}`)
};