const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");

const userSchema = new Schema({
   email: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
  
});
userSchema.plugin(passportLocalMongoose); //adds the username and the password automatically

module.exports= mongoose.model("User", userSchema);
