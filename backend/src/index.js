import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.routes.js';
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config();

const app = express(); // создаём app первым деломё
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

// IMPORTANT: fallback
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

