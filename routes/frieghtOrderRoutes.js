const express = require("express");
const {
  createFreightOrder, getMyFreightOrders, getOperatorFreightOrders, updateFreightOrder, deleteFreightOrder
} = require("../controllers/freightOrderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// Logistics Endpoints

router.post("/", authMiddleware, roleMiddleware("buyer","farmer"), asyncHandler(createFreightOrder));
router.get("/my-orders", authMiddleware, roleMiddleware("buyer","farmer"), asyncHandler(getMyFreightOrders));
router.get("/opperator", authMiddleware, roleMiddleware("logistics"), asyncHandler(getOperatorFreightOrders));
router.put("/:id", authMiddleware, roleMiddleware("farmer", "admin", "buyer", "logistics"), asyncHandler(updateFreightOrder));
router.delete("/:id", authMiddleware, roleMiddleware("farmer", "admin", "logistics"), asyncHandler(deleteFreightOrder));

module.exports = router;
