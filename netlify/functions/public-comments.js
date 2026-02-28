// netlify/functions/public-comments.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async () => {
  try {
    const res = await pool.query(`
      SELECT id, author_name, country, service_type, comment, rating, email, submitted_at
      FROM comments
      ORDER BY submitted_at DESC
      LIMIT 10
    `);
    return { statusCode: 200, body: JSON.stringify(res.rows) };
  } catch (err) {
    console.error("DB Error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: "Database query failed", details: err.message }) };
  }
};