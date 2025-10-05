const express = require('express');
const QRCode = require('qrcode-generator');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate QR code for student
router.get('/generate/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Check if user has permission
    if (req.user.role === 'student' && req.user.studentId !== studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const student = await User.findByStudentId(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Generate unique QR data with timestamp for security
    const qrData = {
      studentId: student.student_id,
      userId: student.id,
      timestamp: Date.now(),
      sessionId: uuidv4()
    };

    const qrString = JSON.stringify(qrData);
    const qr = QRCode(0, 'M');
    qr.addData(qrString);
    qr.make();
    const qrCodeDataURL = qr.createDataURL(4, 2);

    res.json({
      qrCode: qrCodeDataURL,
      qrData: qrString,
      student: {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        studentId: student.student_id,
        class: student.class_name
      }
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Scan QR code and mark attendance
router.post('/scan', auth, async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ error: 'QR data is required' });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid QR code format' });
    }

    const { studentId, userId, timestamp } = parsedData;
    
    if (!studentId || !userId || !timestamp) {
      return res.status(400).json({ error: 'Invalid QR code data' });
    }

    // Check if QR code is not too old (valid for 5 minutes)
    const currentTime = Date.now();
    const qrAge = currentTime - timestamp;
    const maxAge = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (qrAge > maxAge) {
      return res.status(400).json({ error: 'QR code has expired. Please generate a new one.' });
    }

    // Verify student exists
    const student = await User.findById(userId);
    if (!student || student.student_id !== studentId) {
      return res.status(404).json({ error: 'Invalid student data in QR code' });
    }

    // Determine attendance status based on current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Assume classes start at 9:00 AM (540 minutes from midnight)
    const classStartTime = 9 * 60; // 9:00 AM
    const lateThreshold = classStartTime + 15; // 15 minutes late threshold
    
    let status = 'present';
    if (currentTimeInMinutes > lateThreshold) {
      status = 'late';
    }

    // Mark attendance
    const attendance = await Attendance.markAttendance(
      userId, 
      status, 
      req.user.role === 'student' ? userId : req.user.id
    );

    res.json({
      message: `Attendance marked as ${status}`,
      attendance: {
        ...attendance,
        student_name: `${student.first_name} ${student.last_name}`,
        student_id: student.student_id
      },
      status
    });
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ error: 'Failed to process QR code' });
  }
});

// Get QR code for current user (student only)
router.get('/my-qr', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can access their QR code' });
    }

    // Generate QR data
    const qrData = {
      studentId: req.user.studentId,
      userId: req.user.id,
      timestamp: Date.now(),
      sessionId: uuidv4()
    };

    const qrString = JSON.stringify(qrData);
    const qr = QRCode(0, 'M');
    qr.addData(qrString);
    qr.make();
    const qrCodeDataURL = qr.createDataURL(4, 2);

    res.json({
      qrCode: qrCodeDataURL,
      qrData: qrString,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    });
  } catch (error) {
    console.error('My QR error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

module.exports = router;