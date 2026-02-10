// netlify/functions/save-message.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const body = new URLSearchParams(event.body);
    const name = body.get('name');
    const email = body.get('email');
    const message = body.get('message');

    if (!name || !email || !message) {
      return { statusCode: 400, body: JSON.stringify({ error: "All fields required" }) };
    }

    await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to save message" }) };
  }
};
