const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number },
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    biceps: { type: Number },
    thighs: { type: Number },
    calves: { type: Number },
    shoulders: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Measurement", measurementSchema);
