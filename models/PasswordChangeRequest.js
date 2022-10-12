const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordChangeRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresIn: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", passwordChangeRequestSchema);
