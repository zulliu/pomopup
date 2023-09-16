import { Pool } from 'pg';

// Create a new pool instance
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'pomopup',
  port: process.env.DB_PORT,
  ssl: false,
});

export default pool;
