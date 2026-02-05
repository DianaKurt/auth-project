import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUniqIdValue } from '../utils/getUniqIdValue.js';
import auth from '../middleware/auth.js';
import pool from '../db.js';

const router = Router();


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [getUniqIdValue(), name, email, passwordHash, 'active']
    );
    

    res.json({ message: 'Registered successfully' });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
  
    // PostgreSQL unique violation
    if (err.code === '23505') {
      return res.status(409).json({
        message: 'Email already exists'
      });
    }
  
    return res.status(500).json({
      message: 'Registration failed'
    });
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


//get users
router.get('/users', auth, async (req, res) => {
  const { sort = 'last_login', order = 'desc' } = req.query;

  // IMPORTANT: whitelist, SQL injection
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

//block users
router.post('/users/block', auth, async (req, res) => {
  const { ids } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET status = 'blocked' WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    console.log('ROWS BLOCKED:', result.rowCount);
    res.json({ success: true });
  } catch (err) {
    console.error('BLOCK ERROR:', err);
    res.status(500).json({ error: 'Failed to block users' });
  }
});
//unblock users
router.post('/users/unblock', auth, async (req, res) => {
  const { ids } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET status = 'active' WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    console.log('ROWS UNBLOCKED:', result.rowCount);
    res.json({ success: true });
  } catch (err) {
    console.error('UNBLOCK ERROR:', err);
    res.status(500).json({ error: 'Failed to unblock users' });
  }
});

//delete users
router.delete('/users', auth, async (req, res) => {
  const { ids } = req.body;

  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    console.log('ROWS DELETED:', result.rowCount);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ error: 'Failed to delete users' });
  }
});

export default router;