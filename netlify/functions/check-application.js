// netlify/functions/check-application.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const { ref } = event.queryStringParameters || {};
    if (!ref) {
      return { statusCode: 400, body: JSON.stringify({ error: "Reference required" }) };
    }

    const res = await pool.query(
      'SELECT reference_code, request_type, status, full_name FROM applications WHERE reference_code = $1',
      [ref.toUpperCase()]
    );

    if (res.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
    }

    const app = res.rows[0];
    return {
      statusCode: 200,
      body: JSON.stringify({
        reference: app.reference_code,
        type: app.request_type,
        status: app.status,
        name: app.full_name
      })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
