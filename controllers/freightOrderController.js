const pool = require("../config/db");

// CRUD operations for freight Orders
async function createFreightOrder(req, res) {
	const { opp_id, order_id, order_destination, tonnage } = req.body;

	if (!opp_id || !order_id || !order_destination || !tonnage) {
		return res.status(400).json({ message: "opp_id, order_id, order_destination and tonnage are required." });
	}

	const [orders] = await pool.query("SELECT * FROM orders WHERE id = ?", [order_id]);
	if (!orders[0]) return res.status(404).json({ message: "Referenced order not found." });

	const buyerId = req.user && req.user.id ? req.user.id : null;

	const [result] = await pool.query(
		`INSERT INTO freight_orders (buyer_id, opp_id, order_id, order_destination, tonnage)
		 VALUES (?, ?, ?, ?, ?)`,
		[buyerId, opp_id, order_id, order_destination, tonnage]
	);

	res.status(201).json({ message: "Freight order created.", id: result.insertId });
}

async function getMyFreightOrders(req, res) {
	const [rows] = await pool.query(
		`SELECT f.*, l.opp_name, o.total_estimated_price, o.quantity_requested
		 FROM freight_orders f
		 LEFT JOIN logistics_operator_profiles l ON f.opp_id = l.id
		 LEFT JOIN orders o ON f.order_id = o.id
		 WHERE f.buyer_id = ?
		 ORDER BY f.created_at DESC`,
		[req.user.id]
	);

	res.json({ freightOrders: rows });
}

async function getOperatorFreightOrders(req, res) {
	// find operator profile id for this user and return freight orders assigned to that opp
	const [profiles] = await pool.query("SELECT id FROM logistics_operator_profiles WHERE user_id = ?", [req.user.id]);
	const profile = profiles[0];
	if (!profile) return res.status(403).json({ message: "No logistics operator profile found for this user." });

	const [rows] = await pool.query(
		`SELECT f.*, u.full_name AS buyer_name, o.total_estimated_price, o.quantity_requested
		 FROM freight_orders f
		 LEFT JOIN users u ON f.buyer_id = u.id
		 LEFT JOIN orders o ON f.order_id = o.id
		 WHERE f.opp_id = ?
		 ORDER BY f.created_at DESC`,
		[profile.id]
	);

	res.json({ freightOrders: rows });
}

async function updateFreightOrder(req, res) {
	const { order_destination, tonnage, opp_id } = req.body;

	const [rows] = await pool.query("SELECT * FROM freight_orders WHERE id = ?", [req.params.id]);
	const freight = rows[0];
	if (!freight) return res.status(404).json({ message: "Freight order not found." });

	// permission: buyer, operator assigned to this freight, or admin
	if (req.user.role !== 'admin') {
		const isBuyer = freight.buyer_id === req.user.id;
		// check operator profile id for user
		const [profiles] = await pool.query("SELECT id FROM logistics_operator_profiles WHERE user_id = ?", [req.user.id]);
		const profile = profiles[0];
		const isOperator = profile && freight.opp_id === profile.id;
		if (!isBuyer && !isOperator) return res.status(403).json({ message: "Not authorized to update this freight order." });
	}

	const updates = [];
	const params = [];
	if (order_destination !== undefined) { updates.push("order_destination = ?"); params.push(order_destination); }
	if (tonnage !== undefined) { updates.push("tonnage = ?"); params.push(tonnage); }
	if (opp_id !== undefined) { updates.push("opp_id = ?"); params.push(opp_id); }

	if (updates.length === 0) return res.status(400).json({ message: "No updatable fields provided." });

	params.push(req.params.id);
	await pool.query(`UPDATE freight_orders SET ${updates.join(", ")} WHERE id = ?`, params);

	res.json({ message: "Freight order updated." });
}

async function deleteFreightOrder(req, res) {
	const [rows] = await pool.query("SELECT * FROM freight_orders WHERE id = ?", [req.params.id]);
	const freight = rows[0];
	if (!freight) return res.status(404).json({ message: "Freight order not found." });

	if (req.user.role !== 'admin' && freight.buyer_id !== req.user.id) {
		// allow operator to delete only if their profile matches
		const [profiles] = await pool.query("SELECT id FROM logistics_operator_profiles WHERE user_id = ?", [req.user.id]);
		const profile = profiles[0];
		if (!(profile && freight.opp_id === profile.id)) return res.status(403).json({ message: "Not authorized to delete this freight order." });
	}

	await pool.query("DELETE FROM freight_orders WHERE id = ?", [req.params.id]);
	res.json({ message: "Freight order deleted." });
}

module.exports = { createFreightOrder, getMyFreightOrders, getOperatorFreightOrders, updateFreightOrder, deleteFreightOrder };