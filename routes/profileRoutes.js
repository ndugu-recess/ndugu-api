const express = require("express");
const { getProfile, updateFarmerProfile, updateBuyerProfile, searchProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const asyncHandler = require("../middleware/asyncHandler");


const router = express.Router();

router.get("/", authMiddleware, asyncHandler(getProfile));
router.put("/farmer", authMiddleware, roleMiddleware("farmer"), asyncHandler(updateFarmerProfile));
router.put("/buyer", authMiddleware, roleMiddleware("buyer"), asyncHandler(updateBuyerProfile));
router.put("/logistics", authMiddleware, roleMiddleware("logistics","farmer","buyer"), asyncHandler(searchProfile))

module.exports = router;
