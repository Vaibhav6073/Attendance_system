# Attendance Management System

A complete attendance management application with QR code scanning, role-based dashboards, and comprehensive reporting.

## Features

- **Authentication**: Role-based login (Admin/Teacher & Student)
- **QR Code Attendance**: Unique QR codes for each student
- **Dashboards**: Admin and Student dashboards with analytics
- **Reports**: PDF/Excel export capabilities
- **Notifications**: Absentee and low attendance alerts
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Mode**: Theme switching support

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT-based auth
- **QR Code**: qrcode & qr-scanner libraries
- **Charts**: Chart.js
- **PDF Export**: jsPDF
- **Excel Export**: xlsx

## Project Structure

```
attendance_system_new/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── database/          # Database schemas
├── docs/             # Documentation & wireframes
└── README.md
```

## Quick Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and setup**:
```bash
cd attendance_system_new
npm run setup
```

2. **Database setup**:
```bash
npm run db:setup
```

3. **Start development**:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Default Login Credentials

**Admin**:
- Email: admin@school.com
- Password: admin123

**Student**:
- Email: student@school.com
- Password: student123

## Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

**Frontend (.env)**:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

### AWS Deployment (Recommended)
- Frontend: Deploy to S3 + CloudFront
- Backend: Deploy to Lambda + API Gateway
- Database: Use RDS PostgreSQL
- Authentication: Integrate with AWS Cognito

### Traditional Deployment
- Frontend: Any static hosting (Netlify, Vercel)
- Backend: Any Node.js hosting (Heroku, DigitalOcean)
- Database: Managed PostgreSQL service

## API Documentation

API endpoints are documented at `/api/docs` when running the backend.

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License