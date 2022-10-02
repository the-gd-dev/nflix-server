const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: true },
    token: { type: String },
    current_watching : {type: Schema.Types.ObjectId, ref: "Profile"},
    profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
