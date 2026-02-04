// netlify/functions/create-contract.js
const { Pool } = require('pg');

// Neon connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.handler = async (event) => {
  console.log('DB URL loaded:', !!process.env.DATABASE_URL); // ✅ Vérifie que l'URL est chargée

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    // Parse les données du formulaire HTML (application/x-www-form-urlencoded)
    const params = new URLSearchParams(event.body);
    const formData = {
      clientName: params.get('clientName'),
      clientEmail: params.get('clientEmail'),
      requestType: params.get('requestType'),
      status: params.get('status')
    };

    // Validation basique
    if (!formData.clientName || !formData.clientEmail || !formData.requestType || !formData.status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }

    // Génère une référence unique : VX-2026-XXXXXX
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ref = `VX-2026-${randomPart}`;

    // Sauvegarde dans Neon DB
    await pool.query(
      `INSERT INTO contracts (reference, client_name, client_email, type, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [ref, formData.clientName, formData.clientEmail, formData.requestType, formData.status]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ reference: ref })
    };
  } catch (err) {
    console.error('Database error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create contract", details: err.message })
    };
  }
};
