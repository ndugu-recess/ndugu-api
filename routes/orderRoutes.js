const express = require("express");
const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("buyer"), createOrder);
router.get("/my-orders", authMiddleware, roleMiddleware("buyer"), getMyOrders);
router.get("/farmer", authMiddleware, roleMiddleware("farmer"), getFarmerOrders);
router.put("/:id/status", authMiddleware, roleMiddleware("farmer", "admin"), updateOrderStatus);

module.exports = router;
