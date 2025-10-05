import axios from 'axios';
import { LoginCredentials, RegisterData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  
  register: (data: RegisterData) => 
    api.post('/auth/register', data),
  
  verify: () => 
    api.get('/auth/verify'),
};

// User API
export const userAPI = {
  getProfile: () => 
    api.get('/users/profile'),
  
  updateProfile: (data: any) => 
    api.put('/users/profile', data),
  
  getStudents: (classId?: number) => 
    api.get('/users/students', { params: { classId } }),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (studentId: string, status: string) => 
    api.post('/attendance/mark', { studentId, status }),
  
  checkIn: () => 
    api.post('/attendance/checkin'),
  
  getByDate: (date: string, classId?: number) => 
    api.get(`/attendance/date/${date}`, { params: { classId } }),
  
  getStudentAttendance: (studentId: string, startDate?: string, endDate?: string) => 
    api.get(`/attendance/student/${studentId}`, { params: { startDate, endDate } }),
  
  getMyAttendance: (startDate?: string, endDate?: string) => 
    api.get('/attendance/my', { params: { startDate, endDate } }),
  
  getDashboardStats: () => 
    api.get('/attendance/dashboard/stats'),
  
  getStats: (classId?: number, startDate?: string, endDate?: string) => 
    api.get('/attendance/stats', { params: { classId, startDate, endDate } }),
};

// QR API
export const qrAPI = {
  generateQR: (studentId: string) => 
    api.get(`/qr/generate/${studentId}`),
  
  scanQR: (qrData: string) => 
    api.post('/qr/scan', { qrData }),
  
  getMyQR: () => 
    api.get('/qr/my-qr'),
};

// Reports API
export const reportsAPI = {
  getAttendanceReport: (startDate: string, endDate: string, classId?: number, format?: string) => 
    api.get('/reports/attendance', { params: { startDate, endDate, classId, format } }),
  
  getClassSummary: (date?: string) => 
    api.get('/reports/class-summary', { params: { date } }),
  
  getLowAttendance: (threshold?: number, days?: number) => 
    api.get('/reports/low-attendance', { params: { threshold, days } }),
};

export default api;