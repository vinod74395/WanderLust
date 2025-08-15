const express=require("express");
const router=express.Router();
const Listing=require("../model/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")

const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}= require("../cloudConfig.js");
const upload= multer({storage})
router
.route("/")
.get( wrapAsync(listingController.index)) 
.post(isLoggedIn, 
  upload.single('listing[image]'),
  validateListing,
   wrapAsync(
    listingController.createListing)
  );
// .post(upload.single('listing[image]'),(req,res)=>{
//   res.send(req.file);
// })

  //New Route
 router.get("/new",isLoggedIn, listingController.renderNewForm 
  );
  
router
  .route("/:id")
  .get(wrapAsync( 
   listingController.showListing ))
   .put( isLoggedIn,
    isOwner,
    upload.single('listing[image]')
    ,validateListing
    ,wrapAsync(
    listingController.updateListing))
.delete( isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing));

  //EDIT ROUTE
  router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(
    listingController.renderEditForm)
);
module.exports=router;


//   //Index Route
//  router.get("/", wrapAsync(listingController.index));  

  
//   //Show Route
//   router.get("/:id",wrapAsync( 
//    listingController.showListing )
// );
  
  // //Create Route
  // router.post("/",isLoggedIn, validateListing, wrapAsync(
  //   listingController.createListing)
  // );

//UPDATE ROUTE
//   router.put("/:id", isLoggedIn,isOwner,validateListing,wrapAsync(
//     listingController.updateListing)
// );

  //delete route
//   router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)
// );

