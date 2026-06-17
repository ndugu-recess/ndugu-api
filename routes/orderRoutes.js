const express = require("express");
const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("buyer"), asyncHandler(createOrder));
router.get("/my-orders", authMiddleware, roleMiddleware("buyer"), asyncHandler(getMyOrders));
router.get("/farmer", authMiddleware, roleMiddleware("farmer"), asyncHandler(getFarmerOrders));
router.put("/:id/status", authMiddleware, roleMiddleware("farmer", "admin"), asyncHandler(updateOrderStatus));

module.exports = router;
