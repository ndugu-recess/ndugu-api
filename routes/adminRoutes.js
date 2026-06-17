const express = require("express");
const {
  getStats,
  getUsers,
  getProducts,
  getOrders,
  updateUserStatus
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));
router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/products", getProducts);
router.get("/orders", getOrders);
router.put("/users/:id/status", updateUserStatus);

module.exports = router;
