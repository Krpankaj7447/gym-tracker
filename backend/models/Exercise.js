const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null = global/pre-built
    name: { type: String, required: true, trim: true },
    muscle: { type: String, required: true }, // Chest, Back, Legs, etc.
    type: { type: String, enum: ["Compound", "Isolation"], default: "Compound" },
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
