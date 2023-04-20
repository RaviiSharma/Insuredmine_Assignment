const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        account_name: { type: String },
        account_type: { type: String },
        permium_amount: { type: String },
        permium_amount_written: { type: String},
      
    });
  
  module.exports = mongoose.model("User's Account", accountSchema);