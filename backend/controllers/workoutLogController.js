const WorkoutLog = require("../models/WorkoutLog");

// GET /api/logs
const getLogs = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id }).sort({ date: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/logs/:id
const getLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/logs
const createLog = async (req, res) => {
  try {
    const { date, day, exercises, duration, notes } = req.body;
    if (!day || !exercises?.length)
      return res.status(400).json({ message: "Day and exercises required" });
    const log = await WorkoutLog.create({ user: req.user._id, date, day, exercises, duration, notes });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/logs/:id
const updateLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: "Log not found" });
    Object.assign(log, req.body);
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/logs/:id
const deleteLog = async (req, res) => {
  try {
    await WorkoutLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/logs/stats — streak + totals
const getStats = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id }).sort({ date: -1 });
    const total = logs.length;

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = [...new Set(logs.map((l) => new Date(l.date).toDateString()))];
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
      if (diff === i || diff === i + 1) streak++;
      else break;
    }

    // This week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const thisWeek = logs.filter((l) => new Date(l.date) >= weekStart).length;

    res.json({ total, streak, thisWeek });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLogs, getLog, createLog, updateLog, deleteLog, getStats };
