import jwt from 'jsonwebtoken';
import pool from '../db.js'; // убедись, что db тоже ES-модуль

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET');

    const result = await pool.query(
      'SELECT id, status FROM users WHERE id = $1',
      [decoded.id]
    );

    const user = result.rows[0];

    if (!user || user.status === 'blocked') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default auth;
