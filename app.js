const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError= require("./utils/ExpressError.js")
const {listingSchema}= require("./schema_joi.js")
const Review= require("./models/reviews.js")

// requiring Ejs-Mate for using it combine many templates in our code as when required

const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
// app.use((req, res, next) => {
//   console.log("Incoming:", req.method, req.url);
//   next();
// });

main().then(() => { console.log("connected to database"); })

  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');

}

// Post route for the review writing
app.post("/listings/:id/reviews", async(req,res)=>{
let listing = await Listing.findById(req.params.id);
if (!listing) {
    console.log("Listing not found");
    return next(new ExpressError(404, "Listing not found"));
  }
  if (!req.body.review) {
    console.log("No review data sent");
    return res.status(400).send("No review data");
  }
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

await newReview.save();
await listing.save();
console.log("review was saved");
res.send("new review added ");
});

// app.get("/testListing", async(req,res)=> {
//    let sampleListing=new Listing({
//     title: "My Villa", 
//     description: "BY THE SEA", 
//     price: 1200, 
//     location: "Juhu ,Mumbai", 
//     country: "India",
//    });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successfull testing");
// });


// index route
app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing })
})


// new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");

})

// create route
app.post("/listings", wrapAsync(async (req, res, next) => {
  let result= listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
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

    await newPlace.save();
  res.redirect("/listings");

}));



// it is for fetching the page where all editing part will be done.
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });

})

// update route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body);
  res.redirect("/listings");

})

// delete route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id, req.body);
  res.redirect("/listings");

})

// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }
  res.render("listings/show.ejs", { listing });

})

app.get("/", (req, res) => {
  res.send("root is working");
});

// app.all("*", (req, res, next)=>{
//   next(new ExpressError(404, "Page not found"));
// });

//middleware for handling the errors 
app.use((err, req, res, next) => {
  let{statusCode=500, message= "Something went wrong"}=err;
  res.render("error.ejs",{message});
  // res.status(statusCode).send(message);

})


app.listen(8080, () => {
  console.log("server is listening");
});