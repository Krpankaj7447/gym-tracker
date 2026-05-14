const express = require("express");
const router = express.Router();
const { getLogs, getLog, createLog, updateLog, deleteLog, getStats } = require("../controllers/workoutLogController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/stats", getStats);
router.get("/", getLogs);
router.get("/:id", getLog);
router.post("/", createLog);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);

module.exports = router;
