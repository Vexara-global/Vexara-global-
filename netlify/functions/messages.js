// netlify/functions/messages.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;

    if (method === 'GET') {
      const res = await pool.query('SELECT * FROM messages ORDER BY submitted_at DESC');
      return { statusCode: 200, body: JSON.stringify(res.rows) };
    }

    if (method === 'DELETE') {
      const data = JSON.parse(event.body);
      await pool.query('DELETE FROM messages WHERE id = $1', [data.id]);
      return { statusCode: 200, body: '{}' };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
