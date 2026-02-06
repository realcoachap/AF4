const db = require('../config/db');

class User {
  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT id, name, email, phone, role, verified, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  // Create new user
  static async create(userData) {
    const {
      name,
      email,
      password,
      phone,
      role,
      verificationToken
    } = userData;

    const query = `
      INSERT INTO users (name, email, password, phone, role, verification_token)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, phone, role, verified, created_at, updated_at
    `;
    
    const { rows } = await db.query(query, [
      name,
      email,
      password,
      phone || null,
      role,
      verificationToken
    ]);
    
    return rows[0];
  }

  // Update refresh token
  static async updateRefreshToken(userId, refreshToken) {
    const query = `
      UPDATE users 
      SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
    `;
    await db.query(query, [refreshToken, userId]);
  }

  // Clear refresh token
  static async clearRefreshToken(userId) {
    const query = `
      UPDATE users 
      SET refresh_token = NULL, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `;
    await db.query(query, [userId]);
  }

  // Update user
  static async update(userId, userData) {
    const { name, email, phone, role, verified } = userData;
    
    // Build dynamic query based on provided fields
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (email !== undefined) {
      fields.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    if (phone !== undefined) {
      fields.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }
    if (role !== undefined) {
      fields.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }
    if (verified !== undefined) {
      fields.push(`verified = $${paramCount}`);
      values.push(verified);
      paramCount++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    values.push(userId); // For WHERE clause
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  }

  // Find all users with pagination
  static async findAllWithPagination(limit, offset, filters = {}) {
    let query = 'SELECT id, name, email, phone, role, verified, created_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 1;

    // Apply filters
    if (filters.role) {
      query += ` AND role = $${paramCount}`;
      params.push(filters.role);
      paramCount++;
    }

    if (filters.searchTerm) {
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${filters.searchTerm}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    // Count query for total records
    let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const countParams = [];

    if (filters.role) {
      countQuery += ` AND role = $${paramCount - 2}`; // Adjust param number for count query
      countParams.push(filters.role);
    }

    if (filters.searchTerm) {
      countQuery += ` AND (name ILIKE $${paramCount - 2} OR email ILIKE $${paramCount - 2})`;
      countParams.push(`%${filters.searchTerm}%`);
    }

    const [usersResult, countResult] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams)
    ]);

    return {
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  // Delete user by ID
  static async deleteById(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  // Test database connection
  static async testConnection() {
    await db.query('SELECT NOW()');
    return true;
  }
}

module.exports = User;