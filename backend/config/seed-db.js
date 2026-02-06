/**
 * Database Seed Script for AF4
 * Seeds initial data for the Ascending Fitness platform
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./config/db');

async function seedDb() {
  try {
    console.log('Seeding database with initial data...');

    // Create default admin user (only if not exists)
    const adminEmail = 'admin@ascendingfitness.com';
    const adminCheck = await db.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('AdminPass123!', 12);
      const verificationToken = uuidv4();
      
      await db.query(`
        INSERT INTO users (name, email, password, role, verified, verification_token, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        'System Administrator',
        adminEmail,
        hashedPassword,
        'admin',
        true,  // Verified by default
        verificationToken,
        new Date(),
        new Date()
      ]);
      
      // Create profile for admin
      await db.query(`
        INSERT INTO profiles (user_id, created_at, updated_at)
        VALUES ((SELECT id FROM users WHERE email = $1), $2, $3)
      `, [adminEmail, new Date(), new Date()]);
      
      console.log('✓ Admin user created');
    } else {
      console.log('- Admin user already exists, skipping');
    }

    // Create default trainer user (only if not exists)
    const trainerEmail = 'trainer@ascendingfitness.com';
    const trainerCheck = await db.query('SELECT id FROM users WHERE email = $1', [trainerEmail]);
    
    if (trainerCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('TrainerPass123!', 12);
      const verificationToken = uuidv4();
      
      await db.query(`
        INSERT INTO users (name, email, password, role, verified, verification_token, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        'Default Trainer',
        trainerEmail,
        hashedPassword,
        'trainer',
        true,  // Verified by default
        verificationToken,
        new Date(),
        new Date()
      ]);
      
      // Create profile for trainer
      await db.query(`
        INSERT INTO profiles (user_id, fitness_level, primary_goal, created_at, updated_at)
        VALUES ((SELECT id FROM users WHERE email = $1), $2, $3, $4, $5)
      `, [trainerEmail, 'Advanced', 'Maintain peak physical condition', new Date(), new Date()]);
      
      console.log('✓ Default trainer user created');
    } else {
      console.log('- Default trainer user already exists, skipping');
    }

    console.log('\nDatabase seeding completed successfully!');
    console.log('Initial data:');
    console.log('- Admin user (admin@ascendingfitness.com)');
    console.log('- Trainer user (trainer@ascendingfitness.com)');
    console.log('\nAF4 database is ready with initial data!');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  } finally {
    // Close the database connection
    await db.pool.end();
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDb();
}

module.exports = seedDb;