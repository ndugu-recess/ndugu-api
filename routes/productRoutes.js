const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getProducts));
router.get("/farmer/my-products", authMiddleware, roleMiddleware("farmer"), asyncHandler(getMyProducts));
router.get("/:id", asyncHandler(getProductById));
router.post("/", authMiddleware, roleMiddleware("farmer"), upload.single("image"), asyncHandler(createProduct));
router.put("/:id", authMiddleware, roleMiddleware("farmer"), upload.single("image"), asyncHandler(updateProduct));
router.delete("/:id", authMiddleware, roleMiddleware("farmer", "admin"), asyncHandler(deleteProduct));

module.exports = router;
