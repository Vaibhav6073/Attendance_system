# Setup Instructions - Attendance Management System

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## Quick Start (Recommended)

### Option 1: Using Docker (Easiest)

1. **Clone the repository**:
```bash
git clone <repository-url>
cd attendance_system_new
```

2. **Start with Docker Compose**:
```bash
docker-compose up -d
```

3. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Option 2: Manual Setup

#### 1. Database Setup

**Create PostgreSQL Database**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE attendance_db;

# Create user (optional)
CREATE USER attendance_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE attendance_db TO attendance_user;

# Exit PostgreSQL
\q
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

**Configure .env file**:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

**Run database migrations and seed data**:
```bash
# Create tables
npm run db:migrate

# Insert sample data
npm run db:seed

# Start backend server
npm run dev
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file
nano .env
```

**Configure frontend .env file**:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start frontend development server**:
```bash
npm start
```

## Default Login Credentials

After running the seed script, you can use these credentials:

### Admin Account
- **Email**: admin@school.com
- **Password**: admin123

### Teacher Account
- **Email**: teacher@school.com
- **Password**: teacher123

### Student Accounts
- **Email**: student1@school.com
- **Password**: student123
- **Student ID**: STU001

- **Email**: student2@school.com
- **Password**: student123
- **Student ID**: STU002

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## Project Structure

```
attendance_system_new/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   ├── package.json
│   └── .env.example
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   └── styles/         # CSS styles
│   ├── package.json
│   └── .env.example
├── database/               # Database schemas
├── docs/                   # Documentation
│   ├── wireframes/         # UI/UX wireframes
│   └── api/               # API documentation
├── docker-compose.yml      # Docker configuration
└── README.md
```

## Development Workflow

### Starting Development

1. **Start the database** (if not using Docker):
```bash
# Start PostgreSQL service
sudo service postgresql start
# or on macOS with Homebrew:
brew services start postgresql
```

2. **Start backend** (in one terminal):
```bash
cd backend
npm run dev
```

3. **Start frontend** (in another terminal):
```bash
cd frontend
npm start
```

### Making Changes

1. **Backend changes**: The server will automatically restart with nodemon
2. **Frontend changes**: The browser will automatically reload with hot reloading
3. **Database changes**: Run migrations after schema updates

### Testing

**Backend tests**:
```bash
cd backend
npm test
```

**Frontend tests**:
```bash
cd frontend
npm test
```

## Production Deployment

### Environment Variables

**Backend Production .env**:
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_NAME=attendance_db_prod
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_secure_jwt_secret
FRONTEND_URL=https://your-domain.com
```

**Frontend Production .env**:
```env
REACT_APP_API_URL=https://api.your-domain.com/api
```

### Build for Production

**Backend**:
```bash
cd backend
npm install --production
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

### AWS Deployment (Recommended)

#### Option 1: AWS Amplify + RDS

1. **Frontend**: Deploy to AWS Amplify
2. **Backend**: Deploy to AWS Lambda + API Gateway
3. **Database**: Use AWS RDS PostgreSQL
4. **Authentication**: Integrate with AWS Cognito

#### Option 2: EC2 + RDS

1. **Server**: Deploy to EC2 instance
2. **Database**: Use AWS RDS PostgreSQL
3. **Load Balancer**: Use Application Load Balancer
4. **SSL**: Use AWS Certificate Manager

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and credentials are correct.

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill the process using the port or use a different port.

#### JWT Secret Error
```
Error: JWT secret not provided
```
**Solution**: Set JWT_SECRET in your .env file.

#### QR Scanner Not Working
**Solution**: Ensure you're accessing the app via HTTPS or localhost (camera requires secure context).

### Logs

**Backend logs**:
```bash
cd backend
npm run dev
# Logs will appear in the terminal
```

**Frontend logs**:
```bash
cd frontend
npm start
# Check browser console for errors
```

**Database logs**:
```bash
# PostgreSQL logs location varies by OS
# Ubuntu: /var/log/postgresql/
# macOS: /usr/local/var/log/
```

### Performance Optimization

1. **Database Indexing**: Ensure proper indexes are created
2. **API Caching**: Implement Redis caching for frequent queries
3. **Frontend Optimization**: Use React.memo and useMemo for expensive operations
4. **Image Optimization**: Compress QR code images
5. **Bundle Analysis**: Use webpack-bundle-analyzer to optimize bundle size

## Security Considerations

1. **Environment Variables**: Never commit .env files
2. **JWT Secrets**: Use strong, random secrets in production
3. **Database**: Use strong passwords and limit access
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS properly for production domains
6. **Rate Limiting**: API rate limiting is already implemented
7. **Input Validation**: All inputs are validated on both client and server

## Backup and Recovery

### Database Backup
```bash
# Create backup
pg_dump -U postgres attendance_db > backup.sql

# Restore backup
psql -U postgres attendance_db < backup.sql
```

### Application Backup
```bash
# Backup uploaded files and configuration
tar -czf app_backup.tar.gz backend/uploads/ backend/.env frontend/.env
```

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the API documentation in `docs/api/`
3. Check the wireframes in `docs/wireframes/`
4. Create an issue in the repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.