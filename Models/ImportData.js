const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const userSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    dob: { type: String },
    zip: { type: String },
    email: { type: String},
    phone: { type: String },
    address: { type: String},
    state: { type: String },
    city: { type: String },
    //User's Account 
    account_name: { type:ObjectId  ,ref: "User's Account"},
    account_type: { type: ObjectId,ref: "User's Account" },
    permium_amount: { type: ObjectId ,ref: "User's Account"},
    permium_amount_written: { type: ObjectId,ref: "User's Account"},
    //policy
    policy_mode: { type: ObjectId,ref:"Policy" },
    policy_number: { type: ObjectId ,ref:"Policy"},
    policy_type: { type: ObjectId ,ref:"Policy"},
    policy_start_date: { type: ObjectId,ref:"Policy"},
    policy_end_date: { type: ObjectId ,ref:"Policy"},
    //agent
    agent: { type: ObjectId,ref:"Agent" },
    userType: { type: ObjectId,ref:"Agent" },
    producer: { type: ObjectId ,ref:"Agent"},
    //LOB
    category_name: { type: ObjectId, ref:"LOB" },
    //Carrier
     company_name: { type: ObjectId , ref:"Carrier"},

  });

module.exports = mongoose.model("ImportData", userSchema);