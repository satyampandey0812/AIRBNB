const mongoose= require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); 




async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
    
}
main().then(()=>{console.log("connected to database");})

.catch(err => console.log(err));

const initDB= async ()=> {
   try {await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log ("Data was initialised");
}
catch(err){
    console.log(err);
}}

initDB();