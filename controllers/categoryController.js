const pool = require("../config/db");

async function getCategories(req, res) {
  const [categories] = await pool.query(
    "SELECT * FROM product_categories WHERE status = 'active' ORDER BY name"
  );

  res.json({ categories });
}

async function createCategory(req, res) {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required." });
  }

  const [result] = await pool.query(
    "INSERT INTO product_categories (name, description) VALUES (?, ?)",
    [name, description || null]
  );

  res.status(201).json({ message: "Category created.", id: result.insertId });
}

async function updateCategory(req, res) {
  const { name, description, status } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required." });
  }

  await pool.query(
    "UPDATE product_categories SET name = ?, description = ?, status = ? WHERE id = ?",
    [name, description || null, status || "active", req.params.id]
  );

  res.json({ message: "Category updated." });
}

module.exports = { getCategories, createCategory, updateCategory };
