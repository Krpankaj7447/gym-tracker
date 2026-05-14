const Measurement = require("../models/Measurement");

// GET /api/measurements
const getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.find({ user: req.user._id }).sort({ date: -1 });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/measurements
const addMeasurement = async (req, res) => {
  try {
    const { date, weight, chest, waist, hips, biceps, thighs, calves, shoulders, notes } = req.body;
    const m = await Measurement.create({ user: req.user._id, date, weight, chest, waist, hips, biceps, thighs, calves, shoulders, notes });
    res.status(201).json(m);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/measurements/:id
const deleteMeasurement = async (req, res) => {
  try {
    await Measurement.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Measurement deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMeasurements, addMeasurement, deleteMeasurement };
