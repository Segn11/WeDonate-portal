# WeDonate Portal - Adama City Administration

Official municipal charity management system for Adama City, Ethiopia. This platform digitizes compassion through a secure 3-tier government verification system (Kebele → Woreda → Direct Delivery), ensuring transparent support distribution with full audit trails.

## 🌟 Features

### For Donors
- **Guest Donations**: Donate without registration or login
- **Browse Requests**: View approved beneficiary requests
- **Multiple Donation Types**: Money, food supplies, clothing, medical supplies, educational materials
- **Digital Receipts**: Receive instant digital receipts for donations
- **Donation Tracking**: Track the status and distribution of your donations
- **Google Authentication**: Easy sign-up with Google OAuth

### For Beneficiaries
- **Request Submission**: Submit assistance requests through a guided wizard
- **Request Tracking**: Monitor request status through approval stages
- **Document Upload**: Upload required documents for verification
- **Funding Updates**: Real-time updates on raised amounts

### For Administrators
- **Multi-level Administration**: System, City, Woreda, and Kebele admin dashboards
- **Request Management**: Review, approve, and manage beneficiary requests
- **Donation Management**: Track and manage all donations
- **Distribution Tracking**: Monitor distribution of resources with photo verification
- **Analytics Dashboard**: Comprehensive reports and analytics with real-time metrics
- **User Management**: Manage users across all roles
- **Audit Logging**: Complete audit trail for all system actions
- **Duplicate Detection**: National ID duplicate checking for fraud prevention

### Transparency Portal
- **Public Transparency**: View all donations and distributions
- **Real-time Updates**: Live data on fund allocation
- **Accountability**: Full traceability of resources
- **Live Statistics**: Real-time metrics on funds mobilized, citizens assisted, and active kebeles

### AI-Powered Support
- **ChatBot FAQ**: Intelligent FAQ system with keyword matching
- **AI Integration**: Google Gemini AI for advanced query responses
- **Context-Aware**: Provides relevant answers based on FAQ database
- **Multi-Language Support**: Designed for Amharic and English content

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with Google OAuth
- **API**: RESTful API with comprehensive validation

### Frontend
- **Framework**: React with Vite
- **Styling**: Modern UI with responsive design
- **State Management**: React Context API
- **Components**: Modular, reusable components

## 📁 Project Structure

```
wefun/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   ├── services/              # Business logic
│   │   ├── routes/                # API routes
│   │   ├── middlewares/           # Auth, validation, error handling
│   │   └── utils/                 # Utility functions
│   ├── scripts/                   # Utility scripts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── features/              # Feature-specific pages
│   │   ├── services/              # API clients
│   │   ├── context/               # React contexts
│   │   └── types/                 # TypeScript types
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"

# Database
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
```

4. **Set up database**
```bash
npx prisma db push
npx prisma generate
```

5. **Start the backend server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

4. **Start the frontend server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📊 Database Schema

The system uses PostgreSQL with the following main models:
- **User**: System users (donors, beneficiaries, admins) with role-based access
- **BeneficiaryRequest**: Assistance requests from beneficiaries with 3-tier verification workflow
- **Donation**: Donations from donors (including guest donations) with payment tracking
- **DistributionRecord**: Distribution of resources to beneficiaries with photo verification
- **Notification**: System notifications for users
- **AuditLog**: Complete audit trail for all system actions
- **ChatBotFAQ**: FAQ database for AI-powered support chatbot
- **RequestStatusHistory**: Status change history for beneficiary requests

## 🔐 Authentication

The system supports multiple authentication methods:
- **Google OAuth**: Sign up/login with Google account
- **JWT Tokens**: Secure session management
- **Guest Access**: Unauthenticated users can donate without login

## 🎯 User Roles

- **DONOR**: Can browse requests and make donations (Individual, Company, NGO, Diaspora)
- **BENEFICIARY**: Can submit and track assistance requests with household information
- **SYSTEM_ADMIN**: Full system management and IT security
- **CITY_ADMIN**: City-level administration and executive oversight
- **WOREDA_ADMIN**: Woreda-level administration and regional approval
- **KEBELE_ADMIN**: Kebele-level administration and resident verification

## 🔄 3-Tier Verification System

The platform implements a transparent government verification process:

1. **Kebele Verification** (Tier 1)
   - Citizens submit requests with National/Kebele IDs
   - Local administrators verify household income and residency
   - Flag duplicate requests and fraudulent applications

2. **Woreda Endorsement** (Tier 2)
   - Sub-city supervisors conduct second-tier audit checks
   - Approve campaigns for public publishing
   - Ensure regional balance across Adama

3. **Direct Delivery** (Tier 3)
   - Donations assigned directly to approved requests
   - Distribution logged with delivery photos and beneficiary signatures
   - Instant digital receipt verification codes generated

## 🧪 Testing

### Backend Testing Scripts
```bash
# Test guest donation
npx ts-node scripts/testGuestDonation.ts

# Test donation API
npx ts-node scripts/testDonation.ts

# Test distribution
npx ts-node scripts/testDistribution.ts

# Setup admin users
npx ts-node scripts/setupAdminUsers.ts
```

## 📝 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/google` - Google OAuth
- `GET /auth/me` - Get current user

#### Donations
- `POST /donations` - Create donation (authenticated)
- `POST /donations/guest` - Create guest donation (no auth)
- `GET /donations` - Get all donations
- `GET /donations/:id` - Get donation by ID

#### Requests
- `POST /requests` - Create beneficiary request
- `GET /requests` - Get all requests
- `GET /requests/:id` - Get request by ID
- `PUT /requests/:id` - Update request

#### Distributions
- `POST /distributions` - Create distribution
- `GET /distributions` - Get all distributions
- `GET /distributions/:id` - Get distribution by ID

#### Analytics
- `GET /analytics/overview` - Get system overview statistics
- `GET /analytics/monthly-trends` - Get monthly donation trends
- `GET /analytics/category-distribution` - Get category distribution
- `GET /analytics/kebele-stats` - Get kebele-specific statistics

#### ChatBot
- `GET /chatbot/faqs` - Get all FAQs
- `POST /chatbot/ask` - Ask chatbot a question
- `POST /chatbot/faqs` - Create new FAQ (admin)

#### Audit
- `GET /audit/logs` - Get all audit logs
- `POST /audit/logs` - Create audit log

## 🌐 Deployment

### Backend Deployment
1. Set environment variables in production
2. Build the application: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment
1. Set environment variables in production
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

WeDonate Portal Development Team

## 📞 Support & Contact

For technical support:
- **Email**: tech@adama.gov.et
- **Phone**: +251 22 111 0000 (ext. 5)
- **Response Time**: Within 24 hours

For general inquiries:
- **Email**: support@adama.gov.et
- **Phone**: +251 22 111 0000 / +251 22 112 0011
- **Address**: Adama Mayor Cabinet Office, Bole Road

## 🙏 Acknowledgments

- Adama City Administration
- All contributors and supporters
- The community of donors and beneficiaries
- Kebele and Woreda administrators for their dedication

---

**Note**: This system is designed to improve transparency and efficiency in the donation process for Adama City, ensuring that resources reach those who need them most.
