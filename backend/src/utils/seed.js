const bcrypt = require('bcryptjs');
const db = require('../config/database');

const seedData = async () => {
  try {
    console.log('Seeding database with initial data...');

    // Create classes
    const classesResult = await db.query(`
      INSERT INTO classes (name, description) VALUES
      ('Class 10A', 'Grade 10 Section A'),
      ('Class 10B', 'Grade 10 Section B'),
      ('Class 11A', 'Grade 11 Section A'),
      ('Class 12A', 'Grade 12 Section A')
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `);

    console.log('Classes created:', classesResult.rows);

    // Get class IDs
    const classes = await db.query('SELECT id, name FROM classes ORDER BY id');
    const class10A = classes.rows.find(c => c.name === 'Class 10A');
    const class10B = classes.rows.find(c => c.name === 'Class 10B');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const teacherPassword = await bcrypt.hash('teacher123', 12);
    const studentPassword = await bcrypt.hash('student123', 12);

    // Create admin user
    await db.query(`
      INSERT INTO users (email, password, first_name, last_name, role) VALUES
      ('admin@school.com', $1, 'Admin', 'User', 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword]);

    // Create teacher user
    await db.query(`
      INSERT INTO users (email, password, first_name, last_name, role) VALUES
      ('teacher@school.com', $1, 'John', 'Teacher', 'teacher')
      ON CONFLICT (email) DO NOTHING
    `, [teacherPassword]);

    // Create sample students
    const students = [
      { email: 'student1@school.com', firstName: 'Alice', lastName: 'Johnson', studentId: 'STU001', classId: class10A?.id },
      { email: 'student2@school.com', firstName: 'Bob', lastName: 'Smith', studentId: 'STU002', classId: class10A?.id },
      { email: 'student3@school.com', firstName: 'Charlie', lastName: 'Brown', studentId: 'STU003', classId: class10B?.id },
      { email: 'student4@school.com', firstName: 'Diana', lastName: 'Wilson', studentId: 'STU004', classId: class10B?.id },
      { email: 'student5@school.com', firstName: 'Eva', lastName: 'Davis', studentId: 'STU005', classId: class10A?.id }
    ];

    for (const student of students) {
      await db.query(`
        INSERT INTO users (email, password, first_name, last_name, role, student_id, class_id) VALUES
        ($1, $2, $3, $4, 'student', $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [student.email, studentPassword, student.firstName, student.lastName, student.studentId, student.classId]);
    }

    // Create sample attendance data for the last 7 days
    const studentUsers = await db.query("SELECT id FROM users WHERE role = 'student'");
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const student of studentUsers.rows) {
        // Randomly assign attendance status (80% present, 15% late, 5% absent)
        const rand = Math.random();
        let status = 'present';
        if (rand > 0.95) status = 'absent';
        else if (rand > 0.80) status = 'late';
        
        await db.query(`
          INSERT INTO attendance (user_id, date, status) VALUES
          ($1, $2, $3)
          ON CONFLICT (user_id, date) DO NOTHING
        `, [student.id, dateStr, status]);
      }
    }

    console.log('Database seeded successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@school.com / admin123');
    console.log('Teacher: teacher@school.com / teacher123');
    console.log('Student: student1@school.com / student123');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };