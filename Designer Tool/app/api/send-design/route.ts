import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { designImage, userDetails, deliveryDetails } = body;

    if (!designImage || !userDetails || !deliveryDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Prepare email content
    const emailContent = `
      <h2>New Design Submission</h2>
      
      <h3>User Details:</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Name:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${userDetails.name}</td>
        </tr>
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Email:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${userDetails.email}</td>
        </tr>
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Phone:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${userDetails.phone}</td>
        </tr>
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Company (Optional):</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${userDetails.company || 'N/A'}</td>
        </tr>
      </table>

      <h3>Delivery Details:</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Address:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${deliveryDetails.address}</td>
        </tr>
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">City:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${deliveryDetails.city}</td>
        </tr>
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">State:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${deliveryDetails.state}</td>
        </tr>
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Postal Code:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${deliveryDetails.postalCode}</td>
        </tr>
        <tr style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Country:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${deliveryDetails.country}</td>
        </tr>
      </table>

      <h3>Design Submitted</h3>
      <p>The design image is attached to this email.</p>
    `;

    // Convert base64 image to buffer
    const base64Data = designImage.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NEXT_PUBLIC_SELLER_EMAIL,
      subject: `New T-Shirt Design Submission from ${userDetails.name}`,
      html: emailContent,
      attachments: [
        {
          filename: 'design.png',
          content: imageBuffer,
          contentType: 'image/png',
        },
      ],
    });

    return NextResponse.json(
      { success: true, message: 'Design sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send design. Please try again.' },
      { status: 500 }
    );
  }
}
