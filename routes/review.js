const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../model/review.js");
const Listing=require("../model/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js")
//post route
router.post("/",isLoggedIn, validateReview,
    wrapAsync(reviewController.createReview));

//DElete route
// In routes/review.js
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview));

 module.exports=router;
