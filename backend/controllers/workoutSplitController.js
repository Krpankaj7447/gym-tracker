const WorkoutSplit = require("../models/WorkoutSplit");

const DEFAULT_SPLITS = [
  { name: "Push", days: ["Monday", "Thursday"], exercises: ["Bench Press", "Shoulder Press", "Tricep Dips", "Lateral Raise"] },
  { name: "Pull", days: ["Tuesday", "Friday"], exercises: ["Deadlift", "Pull-ups", "Barbell Row", "Bicep Curl"] },
  { name: "Legs", days: ["Wednesday", "Saturday"], exercises: ["Squat", "Leg Press", "Romanian Deadlift", "Calf Raises"] },
];

// GET /api/splits
const getSplits = async (req, res) => {
  try {
    let splits = await WorkoutSplit.find({ user: req.user._id });
    // Seed defaults if none exist
    if (splits.length === 0) {
      const defaults = DEFAULT_SPLITS.map((s) => ({ ...s, user: req.user._id, isDefault: true }));
      splits = await WorkoutSplit.insertMany(defaults);
    }
    res.json(splits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/splits
const createSplit = async (req, res) => {
  try {
    const { name, days, exercises } = req.body;
    if (!name) return res.status(400).json({ message: "Split name required" });
    const split = await WorkoutSplit.create({ user: req.user._id, name, days: days || [], exercises: exercises || [] });
    res.status(201).json(split);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/splits/:id
const updateSplit = async (req, res) => {
  try {
    const split = await WorkoutSplit.findOne({ _id: req.params.id, user: req.user._id });
    if (!split) return res.status(404).json({ message: "Split not found" });
    Object.assign(split, req.body);
    await split.save();
    res.json(split);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/splits/:id
const deleteSplit = async (req, res) => {
  try {
    await WorkoutSplit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Split deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSplits, createSplit, updateSplit, deleteSplit };
