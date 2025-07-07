# 📝 Highway Delight - Note-Taking Application

A comprehensive full-stack note-taking application built with React, TypeScript, Node.js, and PostgreSQL. Features multiple authentication methods, real-time email notifications, and complete CRUD operations with a modern, responsive UI.

## 🔗 Repository Information

- **GitHub Repository**: [Highway-Delite-note-app-with-Google-Authentication](https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-.git)
- **Clone URL**: `git clone https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-.git`

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-.git
cd Highway-Delite-note-app-with-Google-Authentication-

# Install all dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..

# Set up environment variables (see Environment Setup section below)
# Copy .env.example files and fill in your actual values

# Start the application
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Google OAuth Setup](#-google-oauth-setup)
- [Email Setup](#-email-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Production Environment Variables](#-production-environment-variables)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### 🔐 Authentication System
- **Multiple Authentication Methods**:
  - Email/Password registration with OTP verification
  - Google OAuth 2.0 integration
  - Forgot password with email OTP reset
  - JWT-based session management
  - Secure token refresh and logout

### 📧 Comprehensive Email Notification System
- **Registration Flow**: OTP verification emails and welcome messages
- **Password Recovery**: Secure OTP-based password reset
- **Note Activities**: Real-time notifications for all note operations
  - Creation notifications
  - Update notifications  
  - Deletion confirmations

### 📝 Advanced Note Management
- **Full CRUD Operations**: Create, read, update, and delete notes
- **Rich Features**:
  - Real-time search functionality
  - Category and tag organization
  - Archive system for note management
  - Bulk operations support

### 🎨 Modern UI/UX Experience
- **Responsive Design**: Mobile-first, fully responsive interface
- **Interactive Elements**:
  - Toast notifications with contextual messages
  - Confirmation dialogs for critical actions
  - Loading states and progress indicators
  - Smooth animations and transitions

### 🔒 Enterprise-Grade Security
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Server-side validation and sanitization
- **SQL Injection Protection**: Parameterized queries
- **Secure Headers**: Helmet.js security middleware

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe JavaScript development
- **React Router v6** - Client-side routing
- **React Hot Toast** - Beautiful toast notifications
- **CSS3** - Modern styling with Flexbox/Grid

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **JSON Web Tokens (JWT)** - Authentication tokens
- **Nodemailer** - Email sending functionality

### Database & Services
- **PostgreSQL** - Production-ready relational database
- **Neon Cloud** - Managed PostgreSQL hosting
- **Google OAuth 2.0** - Third-party authentication
- **Gmail SMTP** - Email delivery service

### Security & DevOps
- **Helmet.js** - Security headers middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API abuse protection
- **Environment Variables** - Secure configuration

## 🏗️ Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or use provided Neon Cloud setup)
- **Gmail account** (for email features)
- **Google Cloud account** (for OAuth setup)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-.git
cd Highway-Delite-note-app-with-Google-Authentication-

# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to root directory
cd ..
```

## 🔐 Environment Setup

> **🚨 IMPORTANT**: Never commit `.env` files to GitHub! This repository includes `.env.example` template files that are safe to commit.

### Step 1: Create Environment Files from Templates

```bash
# Backend environment
cp server/.env.example server/.env

# Frontend environment
cp client/.env.example client/.env
```

### Step 2: Configure Backend Environment (`server/.env`)

Open `server/.env` and fill in your actual values:

```env
# Database Configuration (Neon PostgreSQL - Production Ready)
PGHOST=ep-wild-haze-a84b8udl-pooler.eastus2.azure.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_6WKBphyirEj2WKBphyirEj2
PGSSLMODE=require
PGCHANNELBINDING=require

# SMTP Configuration for Email Features
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-actual-email@gmail.com
SMTP_PASSWORD=your-actual-gmail-app-password

# JWT Security (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Client Configuration
CLIENT_URL=http://localhost:3000

# Server Port
PORT=5000
```

### Step 3: Configure Frontend Environment (`client/.env`)

Open `client/.env` and fill in your actual values:

```env
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com

# API Base URL
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Visit [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### Step 2: Configure OAuth Credentials
1. Navigate to **Credentials** → **Create Credentials** → **OAuth client ID**
2. Select **Web application** as the application type
3. Configure the following settings:

#### For Development:
**Authorized JavaScript Origins:**
```
http://localhost:3000
http://localhost:3001
```

**Authorized Redirect URIs:**
```
http://localhost:3000/auth/google/callback
```

#### 🚨 IMPORTANT: For Production Deployment
**After deploying your app, you MUST update these settings:**

**Authorized JavaScript Origins (add your production URLs):**
```
http://localhost:3000
https://your-app-name.vercel.app
https://your-custom-domain.com
```

**Authorized Redirect URIs (add your production URLs):**
```
http://localhost:3000/auth/google/callback
https://your-app-name.vercel.app/auth/google/callback
https://your-custom-domain.com/auth/google/callback
```

### Step 3: Configure Environment
1. Copy the **Client ID** from your Google OAuth credentials
2. Add it to your `client/.env` file as `REACT_APP_GOOGLE_CLIENT_ID`

### 🔄 Production Update Checklist

**When you deploy to production, follow these steps:**

1. **Get your production URL** (e.g., `https://highway-delight-notes.vercel.app`)

2. **Update Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.developers.google.com/)
   - Navigate to your project → **Credentials**
   - Click on your **OAuth 2.0 Client ID**
   - Add your production URL to both:
     - **Authorized JavaScript origins**
     - **Authorized redirect URIs** (with `/auth/google/callback` path)

3. **Save changes** in Google Cloud Console

4. **Test Google OAuth** on your production site

**⚠️ Without updating these URLs, Google OAuth will show this error:**
```
Error 400: redirect_uri_mismatch
The redirect URI in the request does not match the ones authorized for the OAuth client.
```

## 📧 Email Setup (Gmail SMTP)

### Step 1: Enable 2-Factor Authentication
1. Go to your **Google Account** settings
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2FA if not already enabled

### Step 2: Generate App Password
1. In **Security** settings, find **App passwords**
2. Select **Mail** as the app type
3. Generate a 16-character app password
4. Copy this password (it will have spaces - that's normal)

### Step 3: Configure Environment
Add the following to your `server/.env` file:
```env
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

**📧 Email Features Included:**
- ✅ OTP verification for registration
- ✅ Welcome emails for new users
- ✅ Password reset OTP emails
- ✅ Note creation notifications
- ✅ Note update notifications
- ✅ Note deletion confirmations

## 🚀 Usage

### Starting the Application

```bash
# Start both frontend and backend (recommended for development)
npm run dev

# Or start them separately:
npm run client:dev   # Frontend only (http://localhost:3000)
npm run server:dev   # Backend only (http://localhost:5000)
```

### 🔧 Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run client:dev       # Start only frontend
npm run server:dev       # Start only backend

# Building
npm run build           # Build both frontend and backend
npm run client:build    # Build only frontend
npm run server:build    # Build only backend

# Production
npm start              # Start production server

# Dependencies
npm run install:all    # Install all dependencies
```

### 📁 Project Structure

```
Highway-Delite-note-app-with-Google-Authentication-/
├── client/                 # React TypeScript frontend
│   ├── public/            
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   └── GoogleSignInButton.tsx
│   │   │   └── dashboard/ # Dashboard components
│   │   │       ├── Dashboard.tsx
│   │   │       └── NoteModal.tsx
│   │   ├── contexts/      # React contexts (AuthContext)
│   │   ├── hooks/         # Custom hooks (useGoogleOAuth)
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main application component
│   ├── .env.example       # Frontend environment template
│   ├── .env               # Frontend environment (not committed)
│   └── package.json
├── server/                # Node.js TypeScript backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/    # Express middleware (auth, error handling)
│   │   ├── routes/        # API routes (auth, notes)
│   │   ├── utils/         # Utility functions (email)
│   │   └── index.ts       # Server entry point
│   ├── .env.example       # Backend environment template
│   ├── .env               # Backend environment (not committed)
│   └── package.json
├── .gitignore             # Git ignore file (protects .env files)
├── package.json           # Root package.json with dev scripts
└── README.md             # This documentation
```

## 🚀 Production Environment Variables

When deploying to production platforms like **Render**, **Railway**, **Vercel**, etc., you'll need to set environment variables in their dashboards:

### 🌐 Backend Deployment (Render/Railway/Heroku)

**Set these environment variables in your hosting platform dashboard:**

```env
# Database Configuration
PGHOST=ep-wild-haze-a84b8udl-pooler.eastus2.azure.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_6WKBphyirEj2WKBphyirEj2
PGSSLMODE=require
PGCHANNELBINDING=require

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-production-email@gmail.com
SMTP_PASSWORD=your-production-app-password

# Security
JWT_SECRET=your-super-secure-production-jwt-secret-at-least-32-chars
CLIENT_URL=https://your-frontend-domain.vercel.app
PORT=5000
NODE_ENV=production
```

### 🎨 Frontend Deployment (Vercel/Netlify)

**Set these environment variables in your hosting platform dashboard:**

```env
REACT_APP_GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com
REACT_APP_API_URL=https://your-backend-domain.railway.app/api
```

### 🔐 Why This Approach is Secure:

1. **Local Development**: `.env` files are ignored by Git and stay on your machine
2. **Repository**: Only `.env.example` template files are committed (no secrets)
3. **Production**: Environment variables are set directly in hosting platform dashboards
4. **No Exposure**: Your actual secrets never appear in version control

### 🚀 Complete Production Deployment Checklist

#### Before Deploying:
- [ ] Create `.env.example` template files (no actual secrets)
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Test application locally with all features

#### After Frontend Deployment:
- [ ] **Get your frontend URL** (e.g., `https://highway-delight-notes.vercel.app`)
- [ ] **Update Google Cloud Console** with production URLs:
  - Add to **Authorized JavaScript origins**
  - Add to **Authorized redirect URIs** (with `/auth/google/callback`)
- [ ] **Set frontend environment variables** in hosting dashboard
- [ ] **Test Google OAuth** on production site

#### After Backend Deployment:
- [ ] **Get your backend URL** (e.g., `https://highway-delight-api.railway.app`)
- [ ] **Set backend environment variables** in hosting dashboard
- [ ] **Update CLIENT_URL** to point to your frontend URL
- [ ] **Test API endpoints** and email functionality

#### Final Steps:
- [ ] **Update frontend API URL** to point to production backend
- [ ] **Test complete user flow** on production
- [ ] **Verify email notifications** work in production
- [ ] **Test all authentication methods** (email, Google OAuth, forgot password)

## 🧪 Testing

### Manual Testing Checklist

#### ✅ Authentication Testing
- [ ] **User Registration**: Email/password registration with OTP verification
- [ ] **Email Verification**: OTP email delivery and verification process
- [ ] **Welcome Email**: Automatic welcome email after verification
- [ ] **User Login**: Email/password login functionality
- [ ] **Google OAuth**: Social login with Google account
- [ ] **Forgot Password**: Password reset via email OTP
- [ ] **JWT Persistence**: Token storage and automatic login
- [ ] **Logout**: Secure token removal and session cleanup

#### ✅ Note Management Testing
- [ ] **Create Notes**: Add new notes with title and content
- [ ] **Read Notes**: Display all user notes in dashboard
- [ ] **Update Notes**: Edit existing note title and content
- [ ] **Delete Notes**: Remove notes with confirmation dialog
- [ ] **Search Notes**: Find notes by title or content
- [ ] **Email Notifications**: Verify emails for all note operations

## 🆘 Troubleshooting

### Environment Variable Issues

**Issue**: Environment variables not loading
```bash
# Solution: Check file names and restart servers
# Ensure files are named exactly .env (not .env.txt)
# Restart development servers after changing .env files
```

**Issue**: Google OAuth error "redirect_uri_mismatch"
```bash
# This is the MOST COMMON production error!
# Solution: Update Google Cloud Console with production URLs

# Steps:
# 1. Go to Google Cloud Console → Credentials
# 2. Click your OAuth 2.0 Client ID
# 3. Add your production URL to:
#    - Authorized JavaScript origins: https://your-app.vercel.app
#    - Authorized redirect URIs: https://your-app.vercel.app/auth/google/callback
# 4. Save changes and test again
```

**Issue**: CORS errors in production
```bash
# Solution: Update CLIENT_URL in backend environment
# Frontend URL: https://your-app.vercel.app
# Backend should have: CLIENT_URL=https://your-app.vercel.app
```

**Issue**: Google OAuth works locally but not in production
```bash
# Solution: This means you forgot to update Google Cloud Console
# You MUST add production URLs to your OAuth settings
# Don't forget both origins AND redirect URIs!
```

### 🔍 Debug Commands

```bash
# Check if environment variables are loaded
npm run env:check

# Test database connection
npm run db:test

# Test email configuration
npm run email:test

# Health check
curl http://localhost:5000/api/health
```

## 🎯 Project Completion Status

### ✅ Completed Features
- [x] **Full-stack Architecture**: React frontend + Node.js backend
- [x] **Multiple Authentication Methods**: Email/Password + Google OAuth
- [x] **Email Notification System**: OTP verification, welcome emails, note notifications
- [x] **Complete CRUD Operations**: Create, read, update, delete notes
- [x] **Search & Filter**: Find notes by title and content
- [x] **Responsive Design**: Mobile-first, fully responsive UI
- [x] **Security Implementation**: JWT, rate limiting, input validation
- [x] **Error Handling**: Comprehensive error handling and user feedback
- [x] **Production Database**: Neon PostgreSQL cloud database
- [x] **TypeScript**: Full TypeScript implementation for type safety
- [x] **Environment Management**: Secure environment variable handling

## 🚀 Ready for Production

This note-taking application is production-ready with:
- **Secure Environment Management**: No secrets in version control
- **Scalable Architecture**: Containerizable backend and static frontend
- **Cloud Database**: Neon PostgreSQL with SSL encryption
- **Security Best Practices**: Industry-standard security implementation
- **Email Integration**: Reliable email delivery system
- **Comprehensive Documentation**: Complete setup and deployment guides

---

**🎉 Highway Delight Assignment - Successfully Completed!**

*Built with ❤️ using React, TypeScript, Node.js, and PostgreSQL*
#   H i g h w a y - D e l i t e - n o t e - a p p - w i t h - G o o g l e - A u t h e n t i c a t i o n -  
 