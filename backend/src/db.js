import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const { Pool } = pkg;

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false
});

pool.on('connect', () => {
  console.log('PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('PostgreSQL error', err);
});

// 🔹 Проверка соединения (ES Modules)
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      const client = await pool.connect();
      console.log('✅ Connection test successful');
      client.release();
      process.exit(0);
    } catch (err) {
      console.error('❌ Connection test failed', err);
      process.exit(1);
    }
  })();
}

export default pool;