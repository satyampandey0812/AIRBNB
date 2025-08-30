const Listing=require("../models/listing");
const Review= require("../models/reviews");
const User= require("../models/user");

module.exports.renderSignUpForm=async(req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp=async (req, res) => {
    try {
        let { username, email, password } = req.body;//i used try for my custom error handling here
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Logged in Successfully,welcome to Wanderlust");
            res.redirect("/listings");
        }
    );}
   
    catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
}

}

module.exports.renderLoginForm=async(req, res) => {
    res.render("users/login.ejs");
}
module.exports.Login= (req, res) => {
        req.flash("success", "welcome back to Wanderlust!");
         let redirectUrl= res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }

module.exports.Logout=    (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are logged out! ");
        res.redirect("/listings");
    })
}