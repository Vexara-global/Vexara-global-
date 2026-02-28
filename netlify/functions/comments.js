// netlify/functions/comments.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;

    // GET → liste tous les commentaires
    if (method === 'GET') {
      const res = await pool.query('SELECT * FROM comments ORDER BY submitted_at DESC');
      return { statusCode: 200, body: JSON.stringify(res.rows) };
    }

    // DELETE → supprime un commentaire
    if (method === 'DELETE') {
      const data = JSON.parse(event.body);
      await pool.query('DELETE FROM comments WHERE id = $1', [data.id]);
      return { statusCode: 200, body: '{}' };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};