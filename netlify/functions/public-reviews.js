const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const body = new URLSearchParams(event.body);
    const author = body.get('author_name');
    const email = body.get('email');
    const country = body.get('country');
    const rating = parseInt(body.get('rating'));
    const comment = body.get('comment');

    if (!author || !email || !country || isNaN(rating) || rating < 1 || rating > 5 || !comment) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid data" }) };
    }

    await pool.query(
      'INSERT INTO reviews (author_name, email, country, rating, comment, is_approved) VALUES ($1, $2, $3, $4, $5, false)',
      [author, email, country, rating, comment]
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Save failed" }) };
  }
};