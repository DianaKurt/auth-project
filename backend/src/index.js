import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.routes.js';
import path from 'path'

dotenv.config();

const app = express(); // создаём app первым деломё
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// подключаем роуты
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

// раздача фронта
app.use(express.static(path.join('.', 'public')));

// все GET-запросы возвращают index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
