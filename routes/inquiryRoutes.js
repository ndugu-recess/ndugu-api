const express = require("express");
const {
  createInquiry,
  getMyInquiries,
  getFarmerInquiries,
  updateInquiryStatus
} = require("../controllers/inquiryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("buyer"), createInquiry);
router.get("/my-inquiries", authMiddleware, roleMiddleware("buyer"), getMyInquiries);
router.get("/farmer", authMiddleware, roleMiddleware("farmer"), getFarmerInquiries);
router.put("/:id/status", authMiddleware, roleMiddleware("farmer", "admin"), updateInquiryStatus);

module.exports = router;
