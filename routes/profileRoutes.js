const express = require("express");
const { getProfile, updateFarmerProfile, updateBuyerProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/farmer", authMiddleware, roleMiddleware("farmer"), updateFarmerProfile);
router.put("/buyer", authMiddleware, roleMiddleware("buyer"), updateBuyerProfile);

module.exports = router;
