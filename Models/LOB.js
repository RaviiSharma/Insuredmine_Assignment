
const mongoose = require("mongoose");

const lobSchema = new mongoose.Schema(
  {
    category_name: { type: String },

    
  });


module.exports = mongoose.model("LOB", lobSchema);//category name