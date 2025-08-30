const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");




async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');

}
main().then(() => { console.log("connected to database"); })

  .catch(err => console.log(err));

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68ab98a6084b8aada83b3e73"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
  }
  catch (err) {
    console.log(err);
  }
}

initDB();