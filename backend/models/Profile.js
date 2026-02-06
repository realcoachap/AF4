const db = require('../config/db');

class Profile {
  // Get profile by user ID
  static async getByUserId(userId) {
    const query = 'SELECT * FROM profiles WHERE user_id = $1';
    const { rows } = await db.query(query, [userId]);
    return rows[0] || null;
  }

  // Create new profile
  static async create(profileData) {
    const {
      userId,
      age,
      height,
      weight,
      gender,
      emergencyName,
      emergencyPhone,
      emergencyRelationship,
      medicalConditions,
      medications,
      injuriesSurgeries,
      allergies,
      fitnessLevel,
      workedOutBefore,
      exerciseTypes,
      equipmentAccess,
      primaryGoal,
      secondaryGoals,
      targetTimeline,
      sessionsPerWeek,
      favoriteExercises,
      exercisesToAvoid,
      preferredSchedule,
      dietaryRestrictions,
      activityLevel,
      sleepAverage,
      daysPerWeek,
      sessionsPerMonth
    } = profileData;

    const query = `
      INSERT INTO profiles (
        user_id, age, height, weight, gender, emergency_name, emergency_phone, 
        emergency_relationship, medical_conditions, medications, injuries_surgeries, 
        allergies, fitness_level, worked_out_before, exercise_types, equipment_access, 
        primary_goal, secondary_goals, target_timeline, sessions_per_week, 
        favorite_exercises, exercises_to_avoid, preferred_schedule, dietary_restrictions, 
        activity_level, sleep_average, days_per_week, sessions_per_month
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
                $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
      RETURNING *
    `;
    
    const { rows } = await db.query(query, [
      userId,
      age || null,
      height || null,
      weight || null,
      gender || null,
      emergencyName || null,
      emergencyPhone || null,
      emergencyRelationship || null,
      medicalConditions || null,
      medications || null,
      injuriesSurgeries || null,
      allergies || null,
      fitnessLevel || null,
      workedOutBefore || null,
      exerciseTypes || null,
      equipmentAccess || null,
      primaryGoal || null,
      secondaryGoals || null,
      targetTimeline || null,
      sessionsPerWeek || null,
      favoriteExercises || null,
      exercisesToAvoid || null,
      preferredSchedule || null,
      dietaryRestrictions || null,
      activityLevel || null,
      sleepAverage || null,
      daysPerWeek || null,
      sessionsPerMonth || null
    ]);
    
    return rows[0];
  }

  // Update profile
  static async update(userId, profileData) {
    // Build dynamic query based on provided fields
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(profileData)) {
      if (value !== undefined && value !== null) {
        // Convert camelCase to snake_case for database column names
        const columnName = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${columnName} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      // If no fields to update, just return the current profile
      return this.getByUserId(userId);
    }

    values.push(userId); // For WHERE clause
    const query = `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = $${paramCount} RETURNING *`;
    
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  }

  // Delete profile by user ID
  static async deleteByUserId(userId) {
    const query = 'DELETE FROM profiles WHERE user_id = $1 RETURNING *';
    const { rows } = await db.query(query, [userId]);
    return rows[0] || null;
  }

  // Test database connection
  static async testConnection() {
    await db.query('SELECT NOW()');
    return true;
  }
}

module.exports = Profile;