const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  websiteOrInstagram: {
    type: String,
    required: false,
  },
  industryOrNiche: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Creator", creatorSchema);
