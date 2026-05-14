const Exercise = require("../models/Exercise");

const PREBUILT = [
  { name: "Bench Press", muscle: "Chest", type: "Compound" },
  { name: "Incline Dumbbell Press", muscle: "Chest", type: "Compound" },
  { name: "Squat", muscle: "Legs", type: "Compound" },
  { name: "Leg Press", muscle: "Legs", type: "Compound" },
  { name: "Romanian Deadlift", muscle: "Legs", type: "Compound" },
  { name: "Calf Raises", muscle: "Legs", type: "Isolation" },
  { name: "Deadlift", muscle: "Back", type: "Compound" },
  { name: "Pull-ups", muscle: "Back", type: "Compound" },
  { name: "Barbell Row", muscle: "Back", type: "Compound" },
  { name: "Lat Pulldown", muscle: "Back", type: "Compound" },
  { name: "Shoulder Press", muscle: "Shoulders", type: "Compound" },
  { name: "Lateral Raise", muscle: "Shoulders", type: "Isolation" },
  { name: "Bicep Curl", muscle: "Arms", type: "Isolation" },
  { name: "Hammer Curl", muscle: "Arms", type: "Isolation" },
  { name: "Tricep Dips", muscle: "Arms", type: "Compound" },
  { name: "Tricep Pushdown", muscle: "Arms", type: "Isolation" },
];

// GET /api/exercises — global + user's custom
const getExercises = async (req, res) => {
  try {
    let global = await Exercise.find({ user: null });
    if (global.length === 0) {
      global = await Exercise.insertMany(PREBUILT);
    }
    const custom = await Exercise.find({ user: req.user._id });
    res.json([...global, ...custom]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/exercises — add custom
const createExercise = async (req, res) => {
  try {
    const { name, muscle, type } = req.body;
    if (!name || !muscle) return res.status(400).json({ message: "Name and muscle required" });
    const ex = await Exercise.create({ user: req.user._id, name, muscle, type: type || "Compound", isCustom: true });
    res.status(201).json(ex);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/exercises/:id — only custom
const deleteExercise = async (req, res) => {
  try {
    const ex = await Exercise.findOne({ _id: req.params.id, user: req.user._id });
    if (!ex) return res.status(404).json({ message: "Exercise not found or not deletable" });
    await ex.deleteOne();
    res.json({ message: "Exercise deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getExercises, createExercise, deleteExercise };
