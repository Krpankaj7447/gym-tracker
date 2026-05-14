const mongoose = require("mongoose");

const workoutSplitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true }, // e.g. "Push", "Pull", "Legs"
    days: [{ type: String }], // e.g. ["Monday", "Thursday"]
    exercises: [{ type: String }], // exercise names
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutSplit", workoutSplitSchema);
