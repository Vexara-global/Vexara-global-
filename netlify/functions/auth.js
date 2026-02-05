// netlify/functions/auth.js
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "vexara2026";

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    if (body.password === ADMIN_PASSWORD) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
