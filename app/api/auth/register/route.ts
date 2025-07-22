import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../_db';
import User from '../../models/User';
import nodemailer from 'nodemailer';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendWelcomeEmail(to: string, name: string) {
  try {
    // Debugging: Check if the environment variable is loaded.
    console.log('Attempting to send email. User:', process.env.GMAIL_USER ? 'Loaded' : 'Not Loaded');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Clothy Virtual" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Welcome to Clothy Virtual!',
      text: `Hello ${name},\n\nThank you for registering at Clothy Virtual! We are excited to have you as part of our community. If you have any questions, feel free to reach out.\n\nBest regards,\nThe Clothy Virtual Team`,
      html: `<h2>Hello ${name},</h2><p>Thank you for <b>registering at Clothy Virtual</b>! We are excited to have you as part of our community.</p><p>If you have any questions, feel free to reach out.</p><p>Best regards,<br/>The Clothy Virtual Team</p>`,
    });

    console.log('Message sent: %s', info.messageId);
    // For dev: log the preview URL
    console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // We don't want to block registration if email fails, but we should know about it.
    // In a production app, you might want to add this to a retry queue.
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password, role, name } = await req.json();

    if (!email || !password || !role || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (role !== 'buyer' && role !== 'seller') {
      return NextResponse.json({ error: 'Role must be buyer or seller' }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role, name });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(console.error);

    return NextResponse.json({ message: 'User registered', user: { email: user.email, role: user.role, name: user.name, _id: user._id } });
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
} 