
const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    dob: { type: String },
    zip: { type: String },
    email: { type: String},
    phone: { type: String },
    address: { type: String},
    state: { type: String },
    city: { type: String },
    
    
  });


module.exports = mongoose.model("User", newUserSchema);