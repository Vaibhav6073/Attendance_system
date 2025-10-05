const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get attendance report
router.get('/attendance', auth, async (req, res) => {
  try {
    if (!['admin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { startDate, endDate, classId, format = 'json' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    // Get all students in the class/school
    const students = await User.getAllStudents(classId);
    
    // Get attendance data for the date range
    const attendanceData = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayAttendance = await Attendance.getAttendanceByDate(dateStr, classId);
      
      attendanceData.push({
        date: dateStr,
        attendance: dayAttendance
      });
    }

    // Process data for report
    const reportData = students.map(student => {
      const studentAttendance = attendanceData.map(day => {
        const record = day.attendance.find(a => a.user_id === student.id);
        return {
          date: day.date,
          status: record ? record.status : 'absent'
        };
      });

      const totalDays = attendanceData.length;
      const presentDays = studentAttendance.filter(a => a.status === 'present').length;
      const lateDays = studentAttendance.filter(a => a.status === 'late').length;
      const absentDays = totalDays - presentDays - lateDays;
      const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(2) : 0;

      return {
        student: {
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          studentId: student.student_id,
          class: student.class_name
        },
        attendance: studentAttendance,
        summary: {
          totalDays,
          presentDays,
          lateDays,
          absentDays,
          attendancePercentage: parseFloat(attendancePercentage)
        }
      };
    });

    if (format === 'csv') {
      // Generate CSV format
      let csv = 'Student ID,Name,Class,Total Days,Present,Late,Absent,Attendance %\n';
      reportData.forEach(item => {
        csv += `${item.student.studentId},"${item.student.name}","${item.student.class}",${item.summary.totalDays},${item.summary.presentDays},${item.summary.lateDays},${item.summary.absentDays},${item.summary.attendancePercentage}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=attendance-report-${startDate}-to-${endDate}.csv`);
      return res.send(csv);
    }

    res.json({
      reportPeriod: { startDate, endDate },
      classId,
      totalStudents: students.length,
      data: reportData
    });
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ error: 'Failed to generate attendance report' });
  }
});

// Get class-wise summary
router.get('/class-summary', auth, async (req, res) => {
  try {
    if (!['admin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Get attendance for the date
    const attendance = await Attendance.getAttendanceByDate(targetDate);
    
    // Group by class
    const classSummary = {};
    
    attendance.forEach(record => {
      const className = record.class_name || 'No Class';
      
      if (!classSummary[className]) {
        classSummary[className] = {
          className,
          totalStudents: 0,
          present: 0,
          absent: 0,
          late: 0
        };
      }
      
      classSummary[className].totalStudents++;
      classSummary[className][record.status]++;
    });

    // Convert to array and calculate percentages
    const summaryArray = Object.values(classSummary).map(cls => ({
      ...cls,
      attendancePercentage: cls.totalStudents > 0 
        ? ((cls.present + cls.late) / cls.totalStudents * 100).toFixed(2)
        : 0
    }));

    res.json({
      date: targetDate,
      summary: summaryArray
    });
  } catch (error) {
    console.error('Get class summary error:', error);
    res.status(500).json({ error: 'Failed to get class summary' });
  }
});

// Get low attendance students
router.get('/low-attendance', auth, async (req, res) => {
  try {
    if (!['admin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { threshold = 75, days = 30 } = req.query;
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const startDateStr = startDate.toISOString().split('T')[0];

    const students = await User.getAllStudents();
    const lowAttendanceStudents = [];

    for (const student of students) {
      const stats = await Attendance.getAttendanceStats(student.id, null, startDateStr, endDate);
      
      if (stats.attendance_percentage < parseFloat(threshold)) {
        lowAttendanceStudents.push({
          student: {
            id: student.id,
            name: `${student.first_name} ${student.last_name}`,
            studentId: student.student_id,
            class: student.class_name,
            email: student.email
          },
          stats
        });
      }
    }

    // Sort by attendance percentage (lowest first)
    lowAttendanceStudents.sort((a, b) => a.stats.attendance_percentage - b.stats.attendance_percentage);

    res.json({
      threshold: parseFloat(threshold),
      period: { startDate: startDateStr, endDate },
      students: lowAttendanceStudents
    });
  } catch (error) {
    console.error('Get low attendance error:', error);
    res.status(500).json({ error: 'Failed to get low attendance students' });
  }
});

module.exports = router;