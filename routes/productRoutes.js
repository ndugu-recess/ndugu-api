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

const router = express.Router();

router.get("/", getProducts);
router.get("/farmer/my-products", authMiddleware, roleMiddleware("farmer"), getMyProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, roleMiddleware("farmer"), upload.single("image"), createProduct);
router.put("/:id", authMiddleware, roleMiddleware("farmer"), upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("farmer", "admin"), deleteProduct);

module.exports = router;
