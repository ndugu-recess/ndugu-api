const { Pool, types } = require("pg");
require("dotenv").config();

types.setTypeParser(20, (value) => parseInt(value, 10));
types.setTypeParser(1700, (value) => parseFloat(value));

function convertPlaceholders(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function addReturningId(sql) {
  if (!/^\s*insert\s+/i.test(sql) || /\breturning\b/i.test(sql)) {
    return sql;
  }

  return `${sql} RETURNING id`;
}

function getStatementType(sql) {
  return sql.trim().split(/\s+/, 1)[0].toLowerCase();
}

// A connection pool lets many requests reuse a small number of database connections.
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ndugu",
  schema: process.env.DB_SCHEMA || "ndugu",
  max: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

const pool = {
  async query(sql, params = []) {
    const statementType = getStatementType(sql);
    const text = convertPlaceholders(addReturningId(sql));
    const result = await pgPool.query(text, params);
    const metadata = {
      ...result,
      insertId: result.rows[0]?.id,
      affectedRows: result.rowCount
    };

    if (statementType === "select") {
      return [result.rows, result];
    }

    return [metadata, result];
  },

  end() {
    return pgPool.end();
  }
};

module.exports = pool;
