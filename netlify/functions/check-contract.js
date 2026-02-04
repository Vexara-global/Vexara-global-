// netlify/functions/check-contract.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const { reference } = event.queryStringParameters || {};

    if (!reference) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Reference is required" })
      };
    }

    const res = await pool.query(
      'SELECT * FROM contracts WHERE reference = $1',
      [reference.toUpperCase()]
    );

    if (res.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Reference not found" })
      };
    }

    const contract = res.rows[0];
    return {
      statusCode: 200,
      body: JSON.stringify({
        reference: contract.reference,
        type: contract.request_type,
        status: contract.status,
        full_name: contract.full_name
      })
    };
  } catch (err) {
    console.error('Check error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
