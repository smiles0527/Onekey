import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

async function seed() {
  const adminId = uuidv4();
  const hashedPassword = await bcrypt.hash(process.env['DEFAULT_ADMIN_PASSWORD'] || 'admin123', 12);

  // First, ensure the role column exists
  db.run('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"', () => {
    // Ignore error if column already exists
  });

  db.run(
    'INSERT OR IGNORE INTO users (id, username, email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      adminId,
      process.env['DEFAULT_ADMIN_USERNAME'] || 'admin',
      process.env['DEFAULT_ADMIN_EMAIL'] || 'on3keymusic@gmail.com',
      hashedPassword,
      'System',
      'Administrator',
      'super_admin'
    ],
    function(err: any) {
      if (err) {
        console.error('Error seeding admin user:', err);
      } else {
        console.log('Admin user seeded successfully');
      }
      process.exit(0);
    }
  );
}

seed(); 