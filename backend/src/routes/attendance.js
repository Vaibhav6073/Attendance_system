const express = require('express');
const Joi = require('joi');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const markAttendanceSchema = Joi.object({
  studentId: Joi.string().required(),
  status: Joi.string().valid('present', 'absent', 'late').default('present')
});

const getAttendanceSchema = Joi.object({
  date: Joi.date().iso().required(),
  classId: Joi.number().integer().optional()
});

// Mark attendance (Admin/Teacher)
router.post('/mark', auth, async (req, res) => {
  try {
    if (!['admin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error } = markAttendanceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { studentId, status } = req.body;
    
    // Find student by student ID
    const student = await User.findByStudentId(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const attendance = await Attendance.markAttendance(student.id, status, req.user.id);
    
    res.json({
      message: 'Attendance marked successfully',
      attendance: {
        ...attendance,
        student_name: `${student.first_name} ${student.last_name}`,
        student_id: student.student_id
      }
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Self check-in (Student)
router.post('/checkin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can check in' });
    }

    const attendance = await Attendance.markAttendance(req.user.id, 'present');
    
    res.json({
      message: 'Check-in successful',
      attendance
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Check-in failed' });
  }
});

// Get attendance by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const { classId } = req.query;
    
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const attendance = await Attendance.getAttendanceByDate(date, classId);
    
    res.json({
      date,
      attendance
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to get attendance' });
  }
});

// Get student's attendance history
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Students can only view their own attendance
    if (req.user.role === 'student' && req.user.studentId !== studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const student = await User.findByStudentId(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const attendance = await Attendance.getStudentAttendance(student.id, startDate, endDate);
    const stats = await Attendance.getAttendanceStats(student.id, null, startDate, endDate);
    
    res.json({
      student: {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        studentId: student.student_id,
        class: student.class_name
      },
      attendance,
      stats
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ error: 'Failed to get student attendance' });
  }
});

// Get my attendance (for logged-in student)
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can access this endpoint' });
    }

    const { startDate, endDate } = req.query;
    
    const attendance = await Attendance.getStudentAttendance(req.user.id, startDate, endDate);
    const stats = await Attendance.getAttendanceStats(req.user.id, null, startDate, endDate);
    
    res.json({
      attendance,
      stats
    });
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ error: 'Failed to get attendance' });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    if (!['admin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = await Attendance.getDashboardStats();
    
    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
});

// Get attendance statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;
    
    const stats = await Attendance.getAttendanceStats(null, classId, startDate, endDate);
    
    res.json(stats);
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ error: 'Failed to get attendance statistics' });
  }
});

module.exports = router;