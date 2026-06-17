const express = require("express");
const { getCategories, createCategory, updateCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getCategories);
router.post("/", authMiddleware, roleMiddleware("admin"), createCategory);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateCategory);

module.exports = router;
