const db = require('../config/database');

class Attendance {
  static async markAttendance(userId, status = 'present', markedBy = null) {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if attendance already exists for today
    const existingQuery = 'SELECT * FROM attendance WHERE user_id = $1 AND date = $2';
    const existing = await db.query(existingQuery, [userId, today]);
    
    if (existing.rows.length > 0) {
      // Update existing attendance
      const updateQuery = `
        UPDATE attendance 
        SET status = $1, marked_by = $2, updated_at = NOW()
        WHERE user_id = $3 AND date = $4
        RETURNING *
      `;
      const result = await db.query(updateQuery, [status, markedBy, userId, today]);
      return result.rows[0];
    } else {
      // Create new attendance record
      const insertQuery = `
        INSERT INTO attendance (user_id, date, status, marked_by, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      const result = await db.query(insertQuery, [userId, today, status, markedBy]);
      return result.rows[0];
    }
  }

  static async getAttendanceByDate(date, classId = null) {
    let query = `
      SELECT a.*, u.first_name, u.last_name, u.student_id, c.name as class_name
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE a.date = $1
    `;
    const params = [date];
    
    if (classId) {
      query += ' AND u.class_id = $2';
      params.push(classId);
    }
    
    query += ' ORDER BY u.first_name, u.last_name';
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async getStudentAttendance(userId, startDate = null, endDate = null) {
    let query = `
      SELECT a.*, u.first_name, u.last_name
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.user_id = $1
    `;
    const params = [userId];
    
    if (startDate && endDate) {
      query += ' AND a.date BETWEEN $2 AND $3';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY a.date DESC';
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async getAttendanceStats(userId = null, classId = null, startDate = null, endDate = null) {
    let query = `
      SELECT 
        COUNT(*) as total_days,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
        ROUND(
          (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*)), 2
        ) as attendance_percentage
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;
    
    if (userId) {
      paramCount++;
      query += ` AND a.user_id = $${paramCount}`;
      params.push(userId);
    }
    
    if (classId) {
      paramCount++;
      query += ` AND u.class_id = $${paramCount}`;
      params.push(classId);
    }
    
    if (startDate && endDate) {
      paramCount++;
      query += ` AND a.date BETWEEN $${paramCount} AND $${paramCount + 1}`;
      params.push(startDate, endDate);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const queries = {
      totalStudents: 'SELECT COUNT(*) as count FROM users WHERE role = \'student\'',
      presentToday: `
        SELECT COUNT(*) as count 
        FROM attendance a 
        JOIN users u ON a.user_id = u.id 
        WHERE a.date = $1 AND a.status = 'present' AND u.role = 'student'
      `,
      absentToday: `
        SELECT COUNT(*) as count 
        FROM users u 
        LEFT JOIN attendance a ON u.id = a.user_id AND a.date = $1
        WHERE u.role = 'student' AND (a.status IS NULL OR a.status = 'absent')
      `,
      weeklyTrend: `
        SELECT 
          a.date,
          COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present,
          COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        WHERE a.date >= $1 AND u.role = 'student'
        GROUP BY a.date
        ORDER BY a.date
      `
    };
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    const [totalStudents, presentToday, absentToday, weeklyTrend] = await Promise.all([
      db.query(queries.totalStudents),
      db.query(queries.presentToday, [today]),
      db.query(queries.absentToday, [today]),
      db.query(queries.weeklyTrend, [weekAgoStr])
    ]);
    
    return {
      totalStudents: parseInt(totalStudents.rows[0].count),
      presentToday: parseInt(presentToday.rows[0].count),
      absentToday: parseInt(absentToday.rows[0].count),
      weeklyTrend: weeklyTrend.rows
    };
  }
}

module.exports = Attendance;