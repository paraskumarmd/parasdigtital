import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
// import nodemailer from 'nodemailer'; // Temporarily disabled for Edge Runtime

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Required for Cloudflare Pages compatibility
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Store in Supabase database
    const supabase = createServerSupabaseClient();
    
    const tableName = process.env.CONTACT_TABLE_NAME || 'contact_submissions';
    
    const { data: dbData, error: dbError } = await supabase
      .from(tableName)
      .insert([
        {
          name,
          email,
          subject,
          message,
          submitted_at: new Date().toISOString(),
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        }
      ])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to store submission', details: dbError.message },
        { status: 500 }
      );
    }

    // Send email notification (commented out for Edge Runtime compatibility)
    // Note: Nodemailer doesn't work in Edge Runtime
    // For production, consider using Cloudflare Email or Resend
    /*
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'paraskumar.desh@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        <p><small>IP Address: ${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'}</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    */
    
    console.log('Email sending temporarily disabled for Edge Runtime compatibility');

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data: dbData
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
