// netlify/functions/save-submission.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const body = new URLSearchParams(event.body);
    const data = {
      full_name: body.get('full_name'),
      email: body.get('email'),
      nationality: body.get('nationality'),
      date_of_birth: body.get('dob'),
      request_type: body.get('request_type'),
      category: body.get('category'),
      duration: body.get('period'),
      message: body.get('message')
    };

    // Validation basique
    if (!data.full_name || !data.email || !data.nationality || !data.date_of_birth) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    // Insertion dans Neon
    await pool.query(`
      INSERT INTO submissions (
        full_name, email, nationality, date_of_birth,
        request_type, category, duration, message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      data.full_name,
      data.email,
      data.nationality,
      data.date_of_birth,
      data.request_type,
      data.category,
      data.duration,
      data.message
    ]);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Submission error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to save" }) };
  }
};
