const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const profileSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    isContentType: {
      type: String,
    },
    isChildren: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);