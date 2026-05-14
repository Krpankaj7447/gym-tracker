const express = require("express");
const router = express.Router();
const { getExercises, createExercise, deleteExercise } = require("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", getExercises);
router.post("/", createExercise);
router.delete("/:id", deleteExercise);

module.exports = router;
