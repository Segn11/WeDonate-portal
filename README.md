# WeDonate Portal

A comprehensive donation management system for Adama City, Ethiopia. This platform connects donors with beneficiaries, streamlining the donation process while ensuring transparency and accountability.

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
- **Distribution Tracking**: Monitor distribution of resources
- **Analytics Dashboard**: Comprehensive reports and analytics
- **User Management**: Manage users across all roles

### Transparency Portal
- **Public Transparency**: View all donations and distributions
- **Real-time Updates**: Live data on fund allocation
- **Accountability**: Full traceability of resources

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
- **User**: System users (donors, beneficiaries, admins)
- **BeneficiaryRequest**: Assistance requests from beneficiaries
- **Donation**: Donations from donors (including guest donations)
- **DistributionRecord**: Distribution of resources to beneficiaries
- **Notification**: System notifications
- **Analytics**: System analytics data

## 🔐 Authentication

The system supports multiple authentication methods:
- **Google OAuth**: Sign up/login with Google account
- **JWT Tokens**: Secure session management
- **Guest Access**: Unauthenticated users can donate without login

## 🎯 User Roles

- **DONOR**: Can browse requests and make donations
- **BENEFICIARY**: Can submit and track assistance requests
- **SYSTEM_ADMIN**: Full system management
- **CITY_ADMIN**: City-level administration
- **WOREDA_ADMIN**: Woreda-level administration
- **KEBELE_ADMIN**: Kebele-level administration

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

## 📞 Support

For support, please contact the development team or open an issue in the repository.

## 🙏 Acknowledgments

- Adama City Administration
- All contributors and supporters
- The community of donors and beneficiaries

---

**Note**: This system is designed to improve transparency and efficiency in the donation process for Adama City, ensuring that resources reach those who need them most.
