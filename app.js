if(process.env.NODE_ENV !="production"){
require("dotenv").config(); //we only use this env file when we are in development phase 
}




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore= require("connect-mongo");
const flash = require("connect-flash"); 
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User= require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js")


// requiring Ejs-Mate for using it combine many templates in our code as when required

const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");

const dbUrl= process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust"; 


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store= MongoStore.create(
  {
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET
    },
    touchAfter:24*3600,
  }
)


// Home route
// app.get("/", (req, res) => {
//   res.send("root is working");
// });
store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}




app.use(session(sessionOptions));
app.use(flash());

app.use( passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser= req.user;
  next();
})

// app.get("/demouser", async(req,res)=>{
//   let fakeUser= new User({
//     email:"satyam@gmail.com",
//     username:"satyamKumar", 
//   });
//   let registeredUser= await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);


// });

main().then(() => { console.log("connected to database"); })

  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// app.all("*", (req, res, next)=>{
//   next(new ExpressError(404, "Page not found"));
// });

//middleware for handling the errors 
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);

});


// app.listen(8080, () => {
//   console.log("server is listening");
// });
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});