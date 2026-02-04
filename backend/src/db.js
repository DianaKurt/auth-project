import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });


const { Pool } = pkg;
console.log(process.env.POSTGRES_PASSWORD);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

pool.on('connect', () => {
  console.log('PostgreSQL connected');
});

export default pool;

