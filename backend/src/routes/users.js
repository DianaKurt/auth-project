import { Router } from 'express';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const router = Router();

// get users sorted by last login
router.get('/', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, status, last_login FROM users ORDER BY last_login DESC'
  );
  res.json(result.rows);
});

// block users
router.post('/block', auth, async (req, res) => {
  const { ids } = req.body;
  await pool.query(
    'UPDATE users SET status = $1 WHERE id = ANY($2)',
    ['blocked', ids]
  );
  res.json({ message: 'Users blocked' });
});

// delete users
router.delete('/', auth, async (req, res) => {
  const { ids } = req.body;
  await pool.query(
    'DELETE FROM users WHERE id = ANY($1)',
    [ids]
  );
  res.json({ message: 'Users deleted' });
});

// проверка ids
if (!ids || !ids.length) return res.status(400).json({ error: 'No users selected' });

// сортировка по query param
const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
const result = await pool.query(
  `SELECT id, name, email, status, last_login FROM users ORDER BY last_login ${order}`
);


export default router;
