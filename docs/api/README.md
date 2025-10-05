# API Documentation - Attendance Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "message": null,
  "error": "Error message"
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "admin@school.com",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin"
  }
}
```

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "student@school.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "studentId": "STU001",
  "classId": 1
}
```

#### GET /auth/verify
Verify JWT token validity.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "admin@school.com",
    "role": "admin"
  }
}
```

### Users

#### GET /users/profile
Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

#### PUT /users/profile
Update current user's profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@school.com"
}
```

#### GET /users/students
Get all students (Admin/Teacher only).

**Query Parameters:**
- `classId` (optional): Filter by class ID

### Attendance

#### POST /attendance/mark
Mark attendance for a student (Admin/Teacher only).

**Request Body:**
```json
{
  "studentId": "STU001",
  "status": "present"
}
```

**Response:**
```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "id": 1,
    "user_id": 5,
    "date": "2024-01-15",
    "status": "present",
    "student_name": "John Doe",
    "student_id": "STU001"
  }
}
```

#### POST /attendance/checkin
Self check-in for students.

**Headers:** `Authorization: Bearer <token>`

#### GET /attendance/date/:date
Get attendance for a specific date.

**Parameters:**
- `date`: Date in YYYY-MM-DD format

**Query Parameters:**
- `classId` (optional): Filter by class ID

#### GET /attendance/student/:studentId
Get attendance history for a specific student.

**Parameters:**
- `studentId`: Student ID

**Query Parameters:**
- `startDate` (optional): Start date for filtering
- `endDate` (optional): End date for filtering

#### GET /attendance/my
Get attendance for the logged-in student.

**Query Parameters:**
- `startDate` (optional): Start date for filtering
- `endDate` (optional): End date for filtering

#### GET /attendance/dashboard/stats
Get dashboard statistics (Admin/Teacher only).

**Response:**
```json
{
  "totalStudents": 150,
  "presentToday": 142,
  "absentToday": 8,
  "weeklyTrend": [
    {
      "date": "2024-01-15",
      "present": 142,
      "absent": 8
    }
  ]
}
```

### QR Code

#### GET /qr/generate/:studentId
Generate QR code for a student.

**Parameters:**
- `studentId`: Student ID

**Response:**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "qrData": "{\"studentId\":\"STU001\",\"userId\":5,\"timestamp\":1642234567890}",
  "student": {
    "id": 5,
    "name": "John Doe",
    "studentId": "STU001",
    "class": "Class 10A"
  }
}
```

#### POST /qr/scan
Scan QR code and mark attendance.

**Request Body:**
```json
{
  "qrData": "{\"studentId\":\"STU001\",\"userId\":5,\"timestamp\":1642234567890}"
}
```

**Response:**
```json
{
  "message": "Attendance marked as present",
  "attendance": {
    "id": 1,
    "user_id": 5,
    "date": "2024-01-15",
    "status": "present",
    "student_name": "John Doe",
    "student_id": "STU001"
  },
  "status": "present"
}
```

#### GET /qr/my-qr
Get QR code for the logged-in student.

**Response:**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "qrData": "{\"studentId\":\"STU001\",\"userId\":5,\"timestamp\":1642234567890}",
  "expiresAt": "2024-01-15T10:35:00.000Z"
}
```

### Reports

#### GET /reports/attendance
Generate attendance report (Admin/Teacher only).

**Query Parameters:**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `classId` (optional): Filter by class ID
- `format` (optional): Response format (json, csv)

**Response:**
```json
{
  "reportPeriod": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-15"
  },
  "totalStudents": 25,
  "data": [
    {
      "student": {
        "id": 5,
        "name": "John Doe",
        "studentId": "STU001",
        "class": "Class 10A"
      },
      "summary": {
        "totalDays": 15,
        "presentDays": 14,
        "lateDays": 0,
        "absentDays": 1,
        "attendancePercentage": 93.33
      }
    }
  ]
}
```

#### GET /reports/class-summary
Get class-wise attendance summary.

**Query Parameters:**
- `date` (optional): Specific date (defaults to today)

#### GET /reports/low-attendance
Get students with low attendance.

**Query Parameters:**
- `threshold` (optional): Attendance percentage threshold (default: 75)
- `days` (optional): Number of days to consider (default: 30)

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error: Email is required"
}
```

#### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

#### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

#### 404 Not Found
```json
{
  "error": "Student not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Data Models

### User
```json
{
  "id": 1,
  "email": "user@school.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "student_id": "STU001",
  "class_id": 1,
  "class_name": "Class 10A",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Attendance Record
```json
{
  "id": 1,
  "user_id": 5,
  "date": "2024-01-15",
  "status": "present",
  "marked_by": 1,
  "created_at": "2024-01-15T09:00:00.000Z",
  "first_name": "John",
  "last_name": "Doe",
  "student_id": "STU001"
}
```

### Attendance Statistics
```json
{
  "total_days": 30,
  "present_days": 28,
  "absent_days": 1,
  "late_days": 1,
  "attendance_percentage": 93.33
}
```

## Testing

### Using cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"admin123"}'
```

#### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/attendance/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Mark Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"studentId":"STU001","status":"present"}'
```

### Using Postman

1. Import the API collection (if available)
2. Set up environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: Your JWT token after login
3. Use the pre-configured requests

## WebSocket Events (Future Enhancement)

For real-time updates, the following WebSocket events will be supported:

- `attendance_marked`: When attendance is marked
- `student_checkin`: When a student checks in
- `low_attendance_alert`: When a student's attendance drops below threshold
- `daily_report_ready`: When daily reports are generated

## Pagination

For endpoints that return lists, pagination is supported:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field (default: created_at)
- `order`: Sort order (asc, desc, default: desc)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```