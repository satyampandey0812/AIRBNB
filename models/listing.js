// I made this listing.js because we'll make many listing models
//  like this so i don't wanna my app.js to look messy ....


const mongoose = require("mongoose");
const Review = require("./reviews.js");
const Schema = mongoose.Schema;
// const { listingSchema } = require("../schema_joi.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url:String,
        filename: String,
        
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",

    },],
    owner:{
        type:  Schema.Types.ObjectId,
        ref: "User",
    },
});


// this is delete listing handling mongoose middleware which deletes all the related reviews when a listing is deleted....
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;

