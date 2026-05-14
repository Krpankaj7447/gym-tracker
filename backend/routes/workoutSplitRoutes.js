const express = require("express");
const router = express.Router();
const { getSplits, createSplit, updateSplit, deleteSplit } = require("../controllers/workoutSplitController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", getSplits);
router.post("/", createSplit);
router.put("/:id", updateSplit);
router.delete("/:id", deleteSplit);

module.exports = router;
