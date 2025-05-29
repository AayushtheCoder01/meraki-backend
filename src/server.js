const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "amazon42680@gmail.com",
    pass: "wlkm fvzx xxec zbla"
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { email, phone, message } = req.body;
    console.log('Received contact form submission:', { email, phone, message });
    
    // Validate required fields
    if (!email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and message are required' 
      });
    }

    // Email content
    const mailOptions = {
      from: "amazon42680@gmail.com",
      to: "amazon42680@gmail.com",  // Admin email
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully');

    // Send confirmation email to user
    const userMailOptions = {
      from: "amazon42680@gmail.com",
      to: email,
      subject: 'Thank you for contacting Meraki Marketing',
      html: `
        <h2>Thank you for contacting Meraki Marketing</h2>
        <p>We have received your message and will get back to you soon.</p>
        <p>Here's a copy of your message:</p>
        <p>${message}</p>
        <br>
        <p>Best regards,</p>
        <p>Meraki Marketing Team</p>
      `
    };

    await transporter.sendMail(userMailOptions);
    console.log('User confirmation email sent successfully');

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message',
      error: error.message 
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 