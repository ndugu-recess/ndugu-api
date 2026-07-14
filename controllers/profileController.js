const pool = require('../config/db');

async function getProfile(req, res) {
  const profileTable =
    req.user.role === 'farmer'
      ? 'farmer_profiles'
      : req.user.role === 'logistics'
        ? 'logistics_operator_profiles'
        : 'buyer_profiles';
  const [profiles] = await pool.query(
    `SELECT * FROM ${profileTable} WHERE user_id = ?`,
    [req.user.id],
  );

  res.json({ profile: profiles[0] || null });
}

async function updateFarmerProfile(req, res) {
  const { farm_name, farm_description, district, subcounty, village, address } =
    req.body;

  if (!farm_name || !district) {
    return res
      .status(400)
      .json({ message: 'Farm name and district are required.' });
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
    [
      req.user.id,
      farm_name,
      farm_description,
      district,
      subcounty,
      village,
      address,
    ],
  );

  res.json({ message: 'Farmer profile saved successfully.' });
}

async function updateBuyerProfile(req, res) {
  const { buyer_type, business_name, district, address } = req.body;

  if (!buyer_type || !district) {
    return res
      .status(400)
      .json({ message: 'Buyer type and district are required.' });
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
    [req.user.id, buyer_type, business_name, district, address],
  );

  res.json({ message: 'Buyer profile saved successfully.' });
}

// CREATING new Logistics Opperator Profile (C - in CRUD)
async function updateLogisticsOperatorProfile(req, res) {
  const { user_id, opp_name, opp_description, vehicle, max_tonnage, district } =
    req.body;

  if (!user_id || !max_tonnage) {
    return res
      .status(400)
      .json({ message: 'User ID and Max Tonnage are required.' });
  }

  await pool.query(
    `INSERT INTO logistics_operator_profiles
      (user_id, opp_name, opp_description, district, max_tonnage, vehicle)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (user_id) DO UPDATE SET
      opp_name = EXCLUDED.opp_name,
      opp_description = EXCLUDED.opp_description,
      district = EXCLUDED.district,
      max_tonnage = EXCLUDED.max_tonnage,
      vehicle = EXCLUDED.vehicle
      `,

    [user.id, opp_name, opp_description, district, max_tonnage, vehicle],
  );

  res.json({ message: 'Logistics Operator profile saved successfully.' });
}

async function searchProfile(req, res) {
  const profileTable =
    req.user.role === 'farmer'
      ? 'farmer_profiles'
      : req.user.role === 'logistics'
        ? 'logistics_operator_profiles'
        : 'buyer_profiles';

  const  query  = req.body;

  const allowedFilterFields = [
    'opp_name',
    'district',
    'buyer_type',
    'business_name',
    'farm_name',
    'address',
    'subcounty',
    'village',
    'vehicle',
    'max_tonnage'
  ];
  const filters = [];

  for (const key of Object.keys(query)) {
    if (allowedFilterFields.includes(key) && query[key] != null) {
      filters.push({ key, value: query[key] });
    }
  }

  if (!filters.length) {
    return res
      .status(400)
      .json({ message: 'No valid search fields provided.' });
  }

  const whereSql = filters.map((f) => `${f.key} = ?`).join(' AND ');
  const params = filters.map((f) => f.value);

  const [profiles] = await pool.query(
    `SELECT * FROM ${profileTable} f WHERE ${whereSql}`,
    params,
  );

  res.json({ profile: profiles || [] });
}

module.exports = {
  getProfile,
  updateFarmerProfile,
  updateBuyerProfile,
  updateLogisticsOperatorProfile,
  searchProfile
};
