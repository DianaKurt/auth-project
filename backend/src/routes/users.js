import { Router } from 'express';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const router = Router();

// GET /users — список пользователей с сортировкой по last_login
router.get('/', auth, async (req, res) => {
  try {
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
    const result = await pool.query(
      `SELECT id, name, email, status, last_login 
       FROM users 
       ORDER BY last_login ${order}`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('USERS GET ERROR:', err);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// POST /users/block — блокировка пользователей
router.post('/block', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) {
      return res.status(400).json({ error: 'No users selected' });
    }

    await pool.query(
      'UPDATE users SET status = $1 WHERE id = ANY($2)',
      ['blocked', ids]
    );
    res.json({ message: 'Users blocked' });
  } catch (err) {
    console.error('BLOCK USERS ERROR:', err);
    res.status(500).json({ error: 'Failed to block users' });
  }
});

// POST /users/unblock — разблокировка пользователей
router.post('/unblock', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) {
      return res.status(400).json({ error: 'No users selected' });
    }

    await pool.query(
      'UPDATE users SET status = $1 WHERE id = ANY($2)',
      ['active', ids]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('UNBLOCK USERS ERROR:', err);
    res.status(500).json({ error: 'Failed to unblock users' });
  }
});

// DELETE /users — удаление пользователей
router.delete('/', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) {
      return res.status(400).json({ error: 'No users selected' });
    }

    await pool.query(
      'DELETE FROM users WHERE id = ANY($1)',
      [ids]
    );
    res.json({ message: 'Users deleted' });
  } catch (err) {
    console.error('DELETE USERS ERROR:', err);
    res.status(500).json({ error: 'Failed to delete users' });
  }
});

export default router;
