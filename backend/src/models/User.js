const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, firstName, lastName, role, studentId, classId } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = `
      INSERT INTO users (email, password, first_name, last_name, role, student_id, class_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, email, first_name, last_name, role, student_id, class_id, created_at
    `;
    
    const result = await db.query(query, [email, hashedPassword, firstName, lastName, role, studentId, classId]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT u.*, c.name as class_name 
      FROM users u 
      LEFT JOIN classes c ON u.class_id = c.id 
      WHERE u.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByStudentId(studentId) {
    const query = 'SELECT * FROM users WHERE student_id = $1';
    const result = await db.query(query, [studentId]);
    return result.rows[0];
  }

  static async getAllStudents(classId = null) {
    let query = `
      SELECT u.*, c.name as class_name 
      FROM users u 
      LEFT JOIN classes c ON u.class_id = c.id 
      WHERE u.role = 'student'
    `;
    const params = [];
    
    if (classId) {
      query += ' AND u.class_id = $1';
      params.push(classId);
    }
    
    query += ' ORDER BY u.first_name, u.last_name';
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async updateProfile(id, updates) {
    const { firstName, lastName, email } = updates;
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, email, first_name, last_name, role, student_id, class_id
    `;
    
    const result = await db.query(query, [firstName, lastName, email, id]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;