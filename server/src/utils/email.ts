import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`Welcome email would be sent to ${email} for user ${name} (SMTP not configured)`);
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Welcome to Highway Delight Assignment!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Highway Delight Assignment, ${name}!</h2>
          <p>Thank you for signing up for our note-taking application.</p>
          <p>You can now:</p>
          <ul>
            <li>Create and organize your notes</li>
            <li>Search through your notes</li>
            <li>Archive important notes</li>
            <li>Access your notes from anywhere</li>
          </ul>
          <p>Get started by creating your first note!</p>
          <p>Best regards,<br>Highway Delight Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error - just log it
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset for your Notes App account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The Notes App Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOTPEmail = async (email: string, otp: string) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`OTP email would be sent to ${email} with OTP: ${otp} (SMTP not configured)`);
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Verify your email - Highway Delight Assignment',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification Required</h2>
          <p>Thank you for signing up for Highway Delight Assignment Notes App!</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f8f9fa; border: 2px solid #007bff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>Highway Delight Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error; // Re-throw for OTP since it's critical
  }
};

export const sendPasswordResetOTPEmail = async (email: string, otp: string) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`Password reset OTP would be sent to ${email} with OTP: ${otp} (SMTP not configured)`);
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Password Reset OTP - Highway Delight Assignment',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password for Highway Delight Assignment Notes App.</p>
          <p>Your password reset OTP is:</p>
          <div style="background-color: #f8f9fa; border: 2px solid #dc3545; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #dc3545; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p><strong>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</strong></p>
          <p>Best regards,<br>Highway Delight Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
    throw error; // Re-throw for password reset since it's critical
  }
};

export const sendNoteSavedEmail = async (email: string, userName: string, noteTitle: string, isNew: boolean) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`Note ${isNew ? 'creation' : 'update'} email would be sent to ${email} for note "${noteTitle}" (SMTP not configured)`);
      return;
    }

    const action = isNew ? 'created' : 'updated';
    const actionPastTense = isNew ? 'Created' : 'Updated';
    
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `Note ${actionPastTense} - ${noteTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Note ${actionPastTense} Successfully! 📝</h2>
          <p>Hi ${userName},</p>
          <p>Your note has been ${action} successfully:</p>
          <div style="background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0; color: #28a745;">📄 "${noteTitle}"</h3>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
              ${isNew ? 'Created' : 'Last updated'}: ${new Date().toLocaleString()}
            </p>
          </div>
          <p>You can access your notes anytime from your dashboard.</p>
          <p>Happy note-taking! 🚀</p>
          <p>Best regards,<br>Highway Delight Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Note ${action} email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Error sending note ${isNew ? 'creation' : 'update'} email:`, error);
    // Don't throw error - just log it for note operations
  }
};

export const sendNoteDeletedEmail = async (email: string, userName: string, noteTitle: string) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`Note deletion email would be sent to ${email} for note "${noteTitle}" (SMTP not configured)`);
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `Note Deleted - ${noteTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Note Deleted 🗑️</h2>
          <p>Hi ${userName},</p>
          <p>The following note has been permanently deleted from your account:</p>
          <div style="background-color: #f8f9fa; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0; color: #dc3545;">🗑️ "${noteTitle}"</h3>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
              Deleted on: ${new Date().toLocaleString()}
            </p>
          </div>
          <p><strong>⚠️ This action cannot be undone.</strong></p>
          <p>If this was deleted by mistake, you may need to recreate the note.</p>
          <p>Best regards,<br>Highway Delight Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Note deletion email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending note deletion email:', error);
    // Don't throw error - just log it for note operations
  }
};
