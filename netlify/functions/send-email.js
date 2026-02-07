// netlify/functions/send-email.js
const nodemailer = require('nodemailer');

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

    // Configure transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'requests.vexaraglobal@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // === 1. Email pour TOI (admin) ===
    const adminMail = {
      from: '"Vexara Global" <requests.vexaraglobal@gmail.com>',
      to: 'requests.vexaraglobal@gmail.com',
      subject: `🆕 New Request: ${data.full_name}`,
      html: `
        <h3>New Candidate Application</h3>
        <p><strong>Name:</strong> ${data.full_name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Nationality:</strong> ${data.nationality}</p>
        <p><strong>Date of Birth:</strong> ${data.dob}</p>
        <p><strong>Type:</strong> ${data.request_type}</p>
        <p><strong>Category:</strong> ${data.category}</p>
        <p><strong>Duration:</strong> ${data.period}</p>
        <p><strong>Message:</strong><br>${data.message?.replace(/\n/g, '<br>') || ''}</p>
        <hr>
        <p>💡 You can generate a reference code in the <a href="https://vexaraglobal.netlify.app/admin.html">Admin Panel</a>.</p>
      `
    };

    // === 2. Email pour le CLIENT ===
    const clientMail = {
      from: '"Vexara Global" <requests.vexaraglobal@gmail.com>',
      to: data.email,
      subject: "✅ Your Request Has Been Received!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Vexara Global</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Hello ${data.full_name},</h2>
            <p>Thank you for your interest in international opportunities with Vexara Global!</p>
            <p>Your request has been successfully received. Our team will review your profile and contact you within <strong>48 hours</strong>.</p>
            <p>You can check your application status anytime using your unique reference code (provided later via email).</p>
            <div style="margin: 30px 0; padding: 15px; background: #f0f9ff; border-left: 4px solid #2563eb;">
              <p><strong>What’s next?</strong></p>
              <ul>
                <li>Review by our team</li>
                <li>Reference code assignment</li>
                <li>Contract validation & next steps</li>
              </ul>
            </div>
            <p>Best regards,<br><strong>The Vexara Global Team</strong></p>
          </div>
          <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 0.9em; color: #64748b;">
            © 2026 Vexara Global — International Opportunities Without Registration
          </div>
        </div>
      `
    };

    // Envoie les deux emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(clientMail);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('Email error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send emails", details: err.message })
    };
  }
};
