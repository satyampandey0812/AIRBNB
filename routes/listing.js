const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema_joi");
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");

const listingController= require("../controllers/listings.js");
const multer= require('multer')
const {storage} = require("../cloudConfig.js");
const upload= multer({storage})

// new route
router.get("/new", isLoggedIn,listingController.renderNewForm
);


router.route("/")
.get( wrapAsync(listingController.index))//index route
.post( isLoggedIn,upload.single('listing[image]'), wrapAsync(listingController.createListing));//create route


router.route("/:id")
.get(wrapAsync(listingController.showListing) )// show route
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing,wrapAsync(listingController.updateListing))// update route
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing))// delete route

// it is for fetching the page where all editing part will be done.
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm) )


module.exports = router;