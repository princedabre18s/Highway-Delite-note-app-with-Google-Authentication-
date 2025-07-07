import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import pool from '../config/database';
import { sendWelcomeEmail, sendOTPEmail, sendPasswordResetOTPEmail } from '../utils/email';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const googleLoginSchema = Joi.object({
  credential: Joi.string().required(),
});

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register - Send OTP for verification
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const client = await pool.connect();
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      client.release();
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP temporarily (delete any existing OTP for this email first)
    await client.query('DELETE FROM otps WHERE email = $1', [email]);
    await client.query(
      'INSERT INTO otps (email, otp, name, password, expires_at) VALUES ($1, $2, $3, $4, $5)',
      [email, otp, name, hashedPassword, expiresAt]
    );

    client.release();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      res.status(200).json({ 
        message: 'OTP sent to your email. Please verify to complete registration.',
        email: email
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify OTP and complete registration
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { error } = verifyOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, otp } = req.body;

    const client = await pool.connect();

    // Get OTP record
    const otpRecord = await client.query(
      'SELECT * FROM otps WHERE email = $1 AND otp = $2',
      [email, otp]
    );

    if (otpRecord.rows.length === 0) {
      client.release();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const otpData = otpRecord.rows[0];

    // Check if OTP has expired
    if (new Date() > new Date(otpData.expires_at)) {
      await client.query('DELETE FROM otps WHERE email = $1', [email]);
      client.release();
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Create the user
    const result = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [otpData.name, email, otpData.password]
    );

    // Delete the OTP record
    await client.query('DELETE FROM otps WHERE email = $1', [email]);

    client.release();

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
      message: 'Registration completed successfully!'
    });

  } catch (error: any) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Get user from database
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth Login
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { error } = googleLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { credential } = req.body;

    // Verify Google JWT token (in production, you should verify this with Google's API)
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    
    if (!payload.email || !payload.email_verified) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { email, name, sub: googleId } = payload;
    const client = await pool.connect();

    try {
      // Check if user exists
      let result = await client.query(
        'SELECT id, name, email FROM users WHERE email = $1',
        [email]
      );

      let user;
      if (result.rows.length === 0) {
        // Create new user if doesn't exist
        const insertResult = await client.query(
          'INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING id, name, email',
          [name, email, googleId]
        );
        user = insertResult.rows[0];

        // Welcome email removed - not required for core functionality
        console.log(`New Google user created: ${user.name} (${user.email})`);
      } else {
        user = result.rows[0];
        
        // Update google_id if not set
        await client.query(
          'UPDATE users SET google_id = $1 WHERE id = $2',
          [googleId, user.id]
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const client = await pool.connect();

    // Check if there's a pending OTP for this email
    const existingOTP = await client.query(
      'SELECT * FROM otps WHERE email = $1',
      [email]
    );

    if (existingOTP.rows.length === 0) {
      client.release();
      return res.status(400).json({ message: 'No pending registration found for this email' });
    }

    const otpData = existingOTP.rows[0];

    // Generate new OTP
    const newOtp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update OTP
    await client.query(
      'UPDATE otps SET otp = $1, expires_at = $2 WHERE email = $3',
      [newOtp, expiresAt, email]
    );

    client.release();

    // Send new OTP email
    try {
      await sendOTPEmail(email, newOtp);
      res.status(200).json({ 
        message: 'New OTP sent to your email.',
        email: email
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

  } catch (error: any) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const client = await pool.connect();

    // Check if user exists
    const userResult = await client.query(
      'SELECT id, name FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Generate OTP for password reset
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store password reset OTP (create table if needed)
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      )
    `);

    // Delete any existing password reset OTP for this email
    await client.query('DELETE FROM password_reset_otps WHERE email = $1', [email]);
    
    // Insert new OTP
    await client.query(
      'INSERT INTO password_reset_otps (email, otp, expires_at) VALUES ($1, $2, $3)',
      [email, otp, expiresAt]
    );

    client.release();

    // Send OTP email
    try {
      await sendPasswordResetOTPEmail(email, otp);
      res.status(200).json({ 
        message: 'Password reset OTP sent to your email.',
        email: email
      });
    } catch (emailError) {
      console.error('Failed to send password reset OTP email:', emailError);
      res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset Password with OTP
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const client = await pool.connect();

    // Verify OTP
    const otpResult = await client.query(
      'SELECT * FROM password_reset_otps WHERE email = $1 AND otp = $2',
      [email, otp]
    );

    if (otpResult.rows.length === 0) {
      client.release();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const otpData = otpResult.rows[0];

    // Check if OTP has expired
    if (new Date() > new Date(otpData.expires_at)) {
      await client.query('DELETE FROM password_reset_otps WHERE email = $1', [email]);
      client.release();
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await client.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, email]
    );

    // Delete the OTP record
    await client.query('DELETE FROM password_reset_otps WHERE email = $1', [email]);

    client.release();

    res.status(200).json({ 
      message: 'Password reset successfully! You can now login with your new password.'
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
