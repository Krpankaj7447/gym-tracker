const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  setNumber: { type: Number },
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 }, // 0 = bodyweight
});

const exerciseLogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: [setSchema],
  notes: { type: String },
});

const workoutLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    day: { type: String, required: true }, // "Push", "Pull", "Legs"
    exercises: [exerciseLogSchema],
    duration: { type: Number }, // minutes
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutLog", workoutLogSchema);
