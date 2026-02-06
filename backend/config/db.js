const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // maximum number of clients in the pool
  min: 5,  // minimum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // return an error after 10 seconds if connection could not be established
});

// Add error handler for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process, just log the error
});

// Test database connection function
async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database successfully');
    return true;
  } catch (err) {
    console.error('Database connection error:', err.message);
    return false;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
};