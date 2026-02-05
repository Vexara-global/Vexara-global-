// netlify/functions/applications.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

function generateRef() {
  return `VX-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;

    if (method === 'GET') {
      const id = event.queryStringParameters?.id;
      if (id) {
        const res = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
        return { statusCode: 200, body: JSON.stringify(res.rows[0] || null) };
      } else {
        const res = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
        return { statusCode: 200, body: JSON.stringify(res.rows) };
      }
    }

    if (method === 'POST') {
      const data = JSON.parse(event.body);
      const ref = generateRef();

      const query = `
        INSERT INTO applications (
          full_name, email, nationality, date_of_birth,
          request_type, category, duration,
          reference_code, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, reference_code
      `;
      const values = [
        data.full_name,
        data.email,
        data.nationality,
        data.date_of_birth,
        data.request_type,
        data.category,
        data.duration,
        ref,
        data.status || 'pending'
      ];

      const res = await pool.query(query, values);
      return { statusCode: 200, body: JSON.stringify(res.rows[0]) };
    }

    if (method === 'PUT') {
      const data = JSON.parse(event.body);
      const query = `
        UPDATE applications SET
          full_name = $1, email = $2, nationality = $3, date_of_birth = $4,
          request_type = $5, category = $6, duration = $7, status = $8
        WHERE id = $9
      `;
      const values = [
        data.full_name,
        data.email,
        data.nationality,
        data.date_of_birth,
        data.request_type,
        data.category,
        data.duration,
        data.status,
        data.id
      ];
      await pool.query(query, values);
      return { statusCode: 200, body: '{}' };
    }

    if (method === 'DELETE') {
      const data = JSON.parse(event.body);
      await pool.query('DELETE FROM applications WHERE id = $1', [data.id]);
      return { statusCode: 200, body: '{}' };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
