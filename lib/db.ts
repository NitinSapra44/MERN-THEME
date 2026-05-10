import { Pool } from 'pg';

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS || undefined,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT ?? '5432'),
    });

export default pool;
