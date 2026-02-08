// netlify/functions/send-email.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  try {
    const body = new URLSearchParams(event.body);
    const data = {
      full_name: body.get('full_name'),
      email: body.get('email'),
      nationality: body.get('nationality'),
      dob: body.get('dob'),
      request_type: body.get('request_type'),
      category: body.get('category'),
      period: body.get('period'),
      message: body.get('message')
    };

    // Email pour toi
    await resend.emails.send({
      from: 'Vexara Global <onboarding@resend.dev>',
      to: 'requests.vexaraglobal@gmail.com',
      subject: `🆕 New Request: ${data.full_name}`,
      html: `<p><strong>Name:</strong> ${data.full_name}<br>
             <strong>Email:</strong> ${data.email}</p>`
    });

    // Email pour le client
    await resend.emails.send({
      from: 'Vexara Global <onboarding@resend.dev>',
      to: data.email,
      subject: "✅ Your Request Has Been Received!",
      html: `<h2>Hello ${data.full_name},</h2>
             <p>Thank you! We’ll contact you within 48 hours.</p>`
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
