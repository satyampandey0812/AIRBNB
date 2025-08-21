// I made this listing.js because we'll make many listing models
//  like this so i don't wanna my app.js to look messy ....


const mongoose = require("mongoose");
const reviews = require("./reviews");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            set: (v) =>
                v === "" 
                    ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
                    : v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"

    },],
});

const Listing = new mongoose.model("listing", listingSchema);
module.exports = Listing;

