export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'teacher' | 'student';
  student_id?: string;
  class_id?: number;
  class_name?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
  studentId?: string;
  classId?: number;
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by?: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
  student_id?: string;
  class_name?: string;
}

export interface AttendanceStats {
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  attendance_percentage: number;
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  weeklyTrend: Array<{
    date: string;
    present: number;
    absent: number;
  }>;
}

export interface QRData {
  studentId: string;
  userId: number;
  timestamp: number;
  sessionId: string;
}

export interface Class {
  id: number;
  name: string;
  description?: string;
}

export interface Student {
  id: number;
  name: string;
  studentId: string;
  class: string;
  email: string;
}

export interface ReportData {
  student: Student;
  attendance: AttendanceRecord[];
  summary: AttendanceStats;
}

export interface Theme {
  mode: 'light' | 'dark';
}