const express = require("express");
const { getCategories, createCategory, updateCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getCategories));
router.post("/", authMiddleware, roleMiddleware("admin"), asyncHandler(createCategory));
router.put("/:id", authMiddleware, roleMiddleware("admin"), asyncHandler(updateCategory));

module.exports = router;
