# 📝 Highway Delight - Note-Taking Application

> A comprehensive full-stack note-taking application with Google OAuth authentication, email notifications, and modern responsive design.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://highwaydelitegoogleauth.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-)

## 🚀 **Live Application**

- **Frontend**: [https://highwaydelitegoogleauth.netlify.app](https://highwaydelitegoogleauth.netlify.app)
- **Backend API**: [https://highway-delite-note-app-with-google.onrender.com](https://highway-delite-note-app-with-google.onrender.com)
- **Repository**: [GitHub](https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-.git)

## ✨ **Key Features**

🔐 **Multi-Authentication System**
- Email/Password with OTP verification
- Google OAuth 2.0 integration
- Secure JWT-based sessions
- Password reset with email verification

📧 **Email Notifications**
- OTP verification emails
- Welcome & registration confirmations
- Note activity notifications
- Password reset emails

📝 **Note Management**
- Create, edit, delete notes
- Rich text content support
- Search functionality
- Responsive design

🔒 **Security Features**
- Rate limiting protection
- CORS configuration
- Environment-based configuration
- Secure cookie handling

## 🛠️ **Tech Stack**

| Frontend | Backend | Database & Services |
|----------|---------|-------------------|
| React 18 + TypeScript | Node.js + Express | PostgreSQL (Neon) |
| React Router v6 | JWT Authentication | Gmail SMTP |
| React Hot Toast | Nodemailer | Google OAuth 2.0 |
| Axios | Rate Limiting | Netlify (Frontend) |
| Modern CSS3 | Error Handling | Render (Backend) |

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-.git
cd Highway-Delite-note-app-with-Google-Authentication-

# Setup Frontend and Backend
cd client && npm install
cd ../server && npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit the .env files with your credentials

# Start development servers
npm run dev
```

**🌐 Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## ⚙️ **Environment Configuration**

### 📋 **Prerequisites**
- Node.js 16+
- PostgreSQL database (Neon Cloud recommended)
- Gmail account for email features
- Google Cloud Console account

### � **Environment Variables**

**Backend (`server/.env`):**
```env
# Database (Neon PostgreSQL)
PGHOST=your-neon-host.neon.tech
PGDATABASE=your-database
PGUSER=your-username
PGPASSWORD=your-password
PGSSLMODE=require

# Email (Gmail SMTP)
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Security
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
CLIENT_URL=http://localhost:3000
```

**Frontend (`client/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## � **Google OAuth Setup**

1. **Create Project** at [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable APIs**: Google+ API
3. **Create Credentials**: OAuth 2.0 Client ID
4. **Configure URLs**:
   - **Authorized Origins**: `http://localhost:3000`, `https://highwaydelitegoogleauth.netlify.app`
   - **Redirect URIs**: `http://localhost:3000/auth/google/callback`, `https://highwaydelitegoogleauth.netlify.app/auth/google/callback`

## � **Email Setup**

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**: Account Settings → Security → App passwords
3. **Use App Password** in `SMTP_PASSWORD` (not your regular password)

## 🌐 **Deployment**

### Frontend (Netlify)
- **Repository**: [GitHub](https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-.git)
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Base Directory**: `client`

### Backend (Render)
- **Build Command**: `npm install; npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `server`

## 🧪 **API Testing**

### Health Check
```bash
GET https://highway-delite-note-app-with-google.onrender.com/api/health
https://your-app-name.vercel.app/auth/google/callback
https://your-custom-domain.com/auth/google/callback
```

### Step 3: Configure Environment
1. Copy the **Client ID** from your Google OAuth credentials
2. Add it to your `client/.env` file as `REACT_APP_GOOGLE_CLIENT_ID`

```

### Authentication Endpoints
```bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Notes Endpoints
```bash
GET    /api/notes          # Get all user notes
POST   /api/notes          # Create new note
PUT    /api/notes/:id      # Update note
DELETE /api/notes/:id      # Delete note
```

## � **Features Showcase**

### Authentication Flow
1. **Registration**: Email + OTP verification
2. **Login**: Email/password or Google OAuth
3. **Password Reset**: Email-based OTP reset
4. **Session Management**: JWT tokens with auto-refresh

### Note Management
1. **Create Notes**: Rich text content support
2. **Edit Notes**: Real-time updates
3. **Delete Notes**: Confirmation dialogs
4. **Search**: Filter notes by content

### Email Notifications
- Welcome emails for new registrations
- OTP codes for verification
- Note activity updates
- Password reset confirmations

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express API    │◄──►│   PostgreSQL    │
│   (Netlify)     │    │   (Render)      │    │     (Neon)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
  User Interface          Business Logic           Data Storage
  - Authentication        - JWT Validation        - User accounts
  - Note Management       - Email sending         - Notes data
  - Real-time feedback    - Error handling        - Session storage
```

## 🔧 **Development**

### Local Development
```bash
git clone https://github.com/princedabre18s/Highway-Delite-note-app-with-Google-Authentication-.git
cd Highway-Delite-note-app-with-Google-Authentication-
npm install && cd client && npm install && cd ../server && npm install
```

### Available Scripts
- `npm run dev` - Start both client and server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Check code quality

## 📄 **License**

This project is licensed under the MIT License.

## 👨‍💻 **Developer**

**Prince Dabre**
- 📧 Email: 9809.crce@gmail.com
- 🔗 GitHub: [@princedabre18s](https://github.com/princedabre18s)
- 💼 Portfolio: [View Projects](https://github.com/princedabre18s)

---

⭐ **Star this repository if you found it helpful!**
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
---

⭐ **Star this repository if you found it helpful!**
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**🎉 Highway Delight Assignment - Successfully Completed!**

*Built with ❤️ using React, TypeScript, Node.js, and PostgreSQL*   H i g h w a y - D e l i t e - n o t e - a p p - w i t h - G o o g l e - A u t h e n t i c a t i o n - 
 
 