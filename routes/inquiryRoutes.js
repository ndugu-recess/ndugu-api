const express = require("express");
const {
  createInquiry,
  getMyInquiries,
  getFarmerInquiries,
  updateInquiryStatus
} = require("../controllers/inquiryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("buyer"), asyncHandler(createInquiry));
router.get("/my-inquiries", authMiddleware, roleMiddleware("buyer"), asyncHandler(getMyInquiries));
router.get("/farmer", authMiddleware, roleMiddleware("farmer"), asyncHandler(getFarmerInquiries));
router.put("/:id/status", authMiddleware, roleMiddleware("farmer", "admin"), asyncHandler(updateInquiryStatus));

module.exports = router;
