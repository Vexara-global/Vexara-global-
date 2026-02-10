// netlify/functions/messages.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async () => {
  try {
    const res = await pool.query('SELECT * FROM messages ORDER BY submitted_at DESC');
    return { statusCode: 200, body: JSON.stringify(res.rows) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to load messages" }) };
  }
};
