const express = require("express");
const router = express.Router();
const { getMeasurements, addMeasurement, deleteMeasurement } = require("../controllers/measurementController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", getMeasurements);
router.post("/", addMeasurement);
router.delete("/:id", deleteMeasurement);

module.exports = router;
