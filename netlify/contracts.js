// netlify/functions/contracts.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Génère une référence unique
function generateReference() {
  return `VX-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;
    
    // GET: Liste tous les clients ou un seul par ID
    if (method === 'GET') {
      const id = event.queryStringParameters?.id;
      if (id) {
        const res = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);
        return {
          statusCode: 200,
          body: JSON.stringify(res.rows[0])
        };
      } else {
        const res = await pool.query('SELECT * FROM contracts ORDER BY created_at DESC');
        return {
          statusCode: 200,
          body: JSON.stringify(res.rows)
        };
      }
    }

    // POST: Créer un nouveau client
    if (method === 'POST') {
      const data = JSON.parse(event.body);
      const reference = generateReference();
      
      const query = `
        INSERT INTO contracts (
          reference, full_name, email, nationality, dob, request_type, 
          category, period, status, message, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING id, reference
      `;
      
      const values = [
        reference,        data.full_name,
        data.email,
        data.nationality,
        data.dob,
        data.request_type,
        data.category,
        data.period,
        data.status,
        data.message || ''
      ];
      
      const res = await pool.query(query, values);
      return {
        statusCode: 200,
        body: JSON.stringify(res.rows[0])
      };
    }

    // PUT: Modifier un client existant
    if (method === 'PUT') {
      const data = JSON.parse(event.body);
      const query = `
        UPDATE contracts SET
          full_name = $1, email = $2, nationality = $3, dob = $4,
          request_type = $5, category = $6, period = $7, status = $8, message = $9
        WHERE id = $10
      `;
      const values = [
        data.full_name,
        data.email,
        data.nationality,
        data.dob,
        data.request_type,
        data.category,
        data.period,
        data.status,
        data.message || '',
        data.id
      ];
      await pool.query(query, values);
      return { statusCode: 200, body: '{}' };
    }

    // DELETE: Supprimer un client
    if (method === 'DELETE') {
      const data = JSON.parse(event.body);
      await pool.query('DELETE FROM contracts WHERE id = $1', [data.id]);
      return { statusCode: 200, body: '{}' };
    }
    return { statusCode: 405, body: 'Method not allowed' };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
