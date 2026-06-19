const pool = require("../config/db");

async function getProfile(req, res) {
  const profileTable = req.user.role === "farmer" ? "farmer_profiles" : "buyer_profiles";
  const [profiles] = await pool.query(`SELECT * FROM ${profileTable} WHERE user_id = ?`, [req.user.id]);

  res.json({ profile: profiles[0] || null });
}

async function updateFarmerProfile(req, res) {
  const { farm_name, farm_description, district, subcounty, village, address } = req.body;

  if (!farm_name || !district) {
    return res.status(400).json({ message: "Farm name and district are required." });
  }

  await pool.query(
    `INSERT INTO farmer_profiles
      (user_id, farm_name, farm_description, district, subcounty, village, address)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (user_id) DO UPDATE SET
      farm_name = EXCLUDED.farm_name,
      farm_description = EXCLUDED.farm_description,
      district = EXCLUDED.district,
      subcounty = EXCLUDED.subcounty,
      village = EXCLUDED.village,
      address = EXCLUDED.address`,
    [req.user.id, farm_name, farm_description, district, subcounty, village, address]
  );

  res.json({ message: "Farmer profile saved successfully." });
}

async function updateBuyerProfile(req, res) {
  const { buyer_type, business_name, district, address } = req.body;

  if (!buyer_type || !district) {
    return res.status(400).json({ message: "Buyer type and district are required." });
  }

  await pool.query(
    `INSERT INTO buyer_profiles
      (user_id, buyer_type, business_name, district, address)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (user_id) DO UPDATE SET
      buyer_type = EXCLUDED.buyer_type,
      business_name = EXCLUDED.business_name,
      district = EXCLUDED.district,
      address = EXCLUDED.address`,
    [req.user.id, buyer_type, business_name, district, address]
  );

  res.json({ message: "Buyer profile saved successfully." });
}

module.exports = { getProfile, updateFarmerProfile, updateBuyerProfile };
