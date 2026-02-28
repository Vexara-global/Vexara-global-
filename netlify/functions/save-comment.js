// netlify/functions/save-comment.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const body = new URLSearchParams(event.body);
    const author = body.get('author_name');
    const country = body.get('country');
    const service = body.get('service_type');
    const text = body.get('comment');
    const rating = parseInt(body.get('rating'));

    if (!author || !country || !service || !text || isNaN(rating) || rating < 1 || rating > 5) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid data" }) };
    }

    await pool.query(
      'INSERT INTO comments (author_name, country, service_type, comment, rating) VALUES ($1, $2, $3, $4, $5)',
      [author, country, service, text, rating]
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Save failed" }) };
  }
};