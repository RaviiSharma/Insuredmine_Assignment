const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    policy_mode: { type: Number },
    policy_number: { type: String },
    policy_type: { type: String },
    policy_start_date: { type: String},
    policy_end_date: { type: String },
    
  });


module.exports = mongoose.model("Policy", policySchema);