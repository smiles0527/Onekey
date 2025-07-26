import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/db';

const router = Router();

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ? AND is_active = 1', [username], async (err: any, user: any) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env['JWT_SECRET'] || 'fallback-secret'
      );

      db.run('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role || 'user'
        }
      });
    });
    
    // Explicit return for the outer function
    return;
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret') as any;
    
    db.get('SELECT id, username, email, first_name, last_name, role FROM users WHERE id = ?', [decoded.userId], (err: any, user: any) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      return res.json({ 
        user: {
          ...user,
          role: user.role || 'user'
        }
      });
    });
    
    // Explicit return for the outer function
    return;
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router; 