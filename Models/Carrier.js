const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema(
    {
        company_name: { type: String },
      
    });
  
  module.exports = mongoose.model("Carrier", carrierSchema);