// netlify/functions/create-contract.js
console.log('=== START create-contract ===');

try {
  const { Pool } = require('pg');
  console.log('✅ pg loaded');
} catch (e) {
  console.error('❌ Failed to load pg:', e.message);
}

exports.handler = async (event) => {
  console.log('🔹 Request received:', {
    method: event.httpMethod,
    headers: Object.keys(event.headers || {}),
    bodyLength: event.body ? event.body.length : 0,
    hasDBURL: !!process.env.DATABASE_URL
  });

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    // === 1. Vérifie DATABASE_URL ===
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL is MISSING!');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "DATABASE_URL not set in environment" })
      };
    }

    // === 2. Initialise la pool ===
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // nécessaire pour Neon
    });

    // === 3. Parse le formulaire ===
    let formData;
    try {
      const params = new URLSearchParams(event.body);
      formData = {
        clientName: params.get('clientName'),
        clientEmail: params.get('clientEmail'),
        requestType: params.get('requestType'),
        status: params.get('status')
      };
      console.log('📦 Parsed form data:', formData);
    } catch (parseErr) {
      console.error('❌ Form parse error:', parseErr);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Failed to parse form", details: parseErr.message })
      };
    }

    // === 4. Validation ===
    if (!formData.clientName || !formData.clientEmail || !formData.requestType || !formData.status) {
      console.error('❌ Missing fields:', formData);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields", got: formData })
      };
    }

    // === 5. Génère référence ===
    const ref = `VX-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    console.log('🆔 Generated reference:', ref);

    // === 6. Insert DB ===
    await pool.query(
      `INSERT INTO contracts (reference, client_name, client_email, type, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [ref, formData.clientName, formData.clientEmail, formData.requestType, formData.status]
    );

    await pool.end();
    console.log('✅ Contract saved:', ref);

    return {
      statusCode: 200,
      body: JSON.stringify({ reference: ref })
    };

  } catch (err) {
    console.error('💥 FULL ERROR:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        message: err.message,
        stack: err.stack?.split('\n').slice(0, 3).join('\n') // tronqué pour sécurité
      })
    };
  }
};
