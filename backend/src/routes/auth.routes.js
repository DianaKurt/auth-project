import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUniqIdValue } from '/backend/utils/getUniqIdValue.js';
import auth from '../middleware/auth.js';


import pool from '../db.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, status)
       VALUES ($1, $2, $3, $4)`,
      [getUniqIdValue(), name, email, passwordHash]
    );
    

    res.json({ message: 'Registered successfully' });
  } catch (err) {
    // note: email uniqueness error comes from DB index
    res.status(400).json({ error: 'Registration failed' });
  }
});

/**
 * IMPORTANT: login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'User is blocked' });
    }
    

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'SECRET',
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;

router.get('/auth/debug/users', async (req, res) => {
  const result = await pool.query('SELECT id, name, email, status, last_login FROM users');
  res.json(result.rows);
});

router.post('/users/unblock', auth, async (req, res) => {
  const { ids } = req.body;

  await pool.query(
    `UPDATE users 
     SET status = 'active' 
     WHERE id = ANY9($1::uuid[])`,
    [ids]
  );
  console.log('ROWS UPDATED:', result.rowCount);
  res.json({ success: true });
});



router.get('/users', auth, async (req, res) => {
  const { sort = 'last_login', order = 'desc' } = req.query;

  // IMPORTANT: whitelist, защита от SQL injection
  const allowedSort = ['last_login'];
  const allowedOrder = ['asc', 'desc'];

  const sortField = allowedSort.includes(sort) ? sort : 'last_login';
  const sortOrder = allowedOrder.includes(order) ? order : 'desc';

  const result = await pool.query(`
    SELECT id, name, email, status, last_login
    FROM users
    ORDER BY ${sortField} ${sortOrder}
  `);

  res.json(result.rows);
});

