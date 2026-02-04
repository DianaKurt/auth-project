import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express(); // создаём app первым деломё
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// подключаем роуты
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

app.use('/frontend', express.static('frontend'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
