/**
 * Database Initialization Script for AF4
 * Creates required tables and indexes for the Ascending Fitness platform
 */

require('dotenv').config();
const db = require('./config/db');

async function initDb() {
  try {
    console.log('Initializing database...');

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'client',
        verified BOOLEAN DEFAULT FALSE,
        refresh_token VARCHAR(510),
        verification_token VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ Users table created');

    // Create profiles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        age VARCHAR(10),
        height VARCHAR(20),
        weight VARCHAR(20),
        gender VARCHAR(50),
        emergency_name VARCHAR(255),
        emergency_phone VARCHAR(20),
        emergency_relationship VARCHAR(100),
        medical_conditions TEXT,
        medications TEXT,
        injuries_surgeries TEXT,
        allergies TEXT,
        fitness_level VARCHAR(100),
        worked_out_before TEXT,
        exercise_types TEXT,
        equipment_access TEXT,
        primary_goal TEXT,
        secondary_goals TEXT,
        target_timeline VARCHAR(100),
        sessions_per_week VARCHAR(50),
        favorite_exercises TEXT,
        exercises_to_avoid TEXT,
        preferred_schedule TEXT,
        dietary_restrictions TEXT,
        activity_level VARCHAR(100),
        sleep_average VARCHAR(20),
        days_per_week VARCHAR(50),
        sessions_per_month VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ Profiles table created');

    // Create indexes for better performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id)');
    
    console.log('✓ Indexes created');

    // Create updated_at trigger function if it doesn't exist
    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers to automatically update updated_at
    await db.query(`
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await db.query(`
      CREATE TRIGGER update_profiles_updated_at 
      BEFORE UPDATE ON profiles 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✓ Triggers created');

    console.log('\nDatabase initialization completed successfully!');
    console.log('Tables created:');
    console.log('- users');
    console.log('- profiles');
    console.log('\nIndexes created for optimal performance');
    console.log('\nAF4 database is ready for use!');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    // Close the database connection
    await db.pool.end();
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initDb();
}

module.exports = initDb;