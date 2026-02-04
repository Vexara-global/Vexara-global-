// netlify/functions/create-contract.js
const { Pool } = require('pg');
const crypto = require('crypto');

// Neon connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
    console.log('DB URL:', process.env.DATABASE_URL);
  }

  try {
    const formData = event.multiValueHeaders['content-type']?.[0]?.includes('multipart/form-data')
      ? parseMultipart(event)
      : JSON.parse(event.body);

    // Generate unique reference: VX-2026-XXXX
    const ref = `VX-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Save to Neon DB
    await pool.query(
      `INSERT INTO contracts (reference, client_name, client_email, type, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [ref, formData.clientName, formData.clientEmail, formData.requestType, formData.status]
    );

    // TODO: Save file to storage (e.g., AWS S3, but for now just return ref)
    return {
      statusCode: 200,
      body: JSON.stringify({ reference: ref })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create contract" })
    };
  }
};

// Simplified multipart parser (for demo)
function parseMultipart(event) {
  // In production, use a proper library like busboy
  return {
    clientName: 'Demo',
    clientEmail: 'demo@example.com',
    requestType: 'job',
    status: 'pending'
  };
}
