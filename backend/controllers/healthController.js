const User = require('../models/User');

// Health check
const healthCheck = async (req, res) => {
  try {
    res.json({
      status: 'OK',
      message: 'Ascending Fitness v4.0.0 API is running',
      version: '4.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
};

// Database health check
const dbHealthCheck = async (req, res) => {
  try {
    // Test database connection by querying a simple operation
    await User.testConnection();
    
    res.json({
      status: 'OK',
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection is unhealthy',
      error: error.message
    });
  }
};

module.exports = {
  healthCheck,
  dbHealthCheck
};