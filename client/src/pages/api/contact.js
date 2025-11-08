import { Resend } from 'resend';

const resend = new Resend("re_NZ3EoJCj_Mwr3GJNwYKQvkATvkdt2LvB1");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Please fill in all required fields' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: 'group11.saalms.rusl@gmail.com', // Your admin email
      subject: subject || 'New Contact Form Submission',
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="margin-top: 20px;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
              <strong>Message:</strong>
              <p style="margin-top: 10px; line-height: 1.6;">${message}</p>
            </div>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            This email was sent from your Clothy Virtual Store contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      data 
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email. Please try again later.' 
    });
  }
}
