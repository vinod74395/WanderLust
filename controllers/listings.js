const Listing=require("../model/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
  };
  
  module.exports.renderNewForm=(req, res) => {
    res.render("new.ejs");
  };

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate: {
        path: "author",
      },
     
    })
    .populate("owner");
    if(!listing){
     req.flash("error","Requested listing doesnt exist");
     res.redirect("/listings")
    }
     console.log(listing)
    res.render("show.ejs", { listing });
  }

  module.exports.createListing=async (req, res,next) => {
let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send();

    let url= req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename)
     const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image={url,filename};
      newListing.geometry=response.body.features[0].geometry;

      let savedListing=await newListing.save();
      console.log(savedListing);
      req.flash("success","New listing created!");
      res.redirect("/listings");
    }

    module.exports.renderEditForm=async (req,res)=>{
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
         req.flash("error","Requested listing doesnt exist");
         res.redirect("/listings")
        }
         const originalUrl = listing.image.url;
        const transformedImageUrl = originalUrl.replace(
    "/upload/",
    "/upload/h_300,w_250/"
  );
        res.render("edit.ejs", { listing ,transformedImageUrl});
      };


  module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the listing by ID
    const listing = await Listing.findById(id);

    // Destructure updated fields from the form data
    const { title, description, price, location, country, image } = req.body.listing;

    // Update basic fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    // If an image URL is provided (e.g., via form field)
    if (image && image.trim() !== "") {
      listing.image.url = image;
    }

    // If a new file is uploaded, update the image fields
    if (typeof req.file !== "undefined") {
      const url = req.file.path;
      const filename = req.file.filename;
      listing.image = { url, filename };
    }

    // Save the updated listing
    await listing.save();

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Failed to update listing");
    res.redirect(req.get("referer") || "/listings");
  }
};


   module.exports.destroyListing=async(req,res)=>{
    let { id } = req.params;
   let deletedListing= await Listing.findByIdAndDelete(id)
   console.log(deletedListing)
    req.flash("success","Listing is deleted");
    res.redirect("/listings");
  };
