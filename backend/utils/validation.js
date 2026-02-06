const Joi = require('joi');

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional().allow(null, ''),
  role: Joi.string().valid('client', 'trainer', 'admin').default('client'),
  verified: Joi.boolean().default(false)
});

const profileSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  age: Joi.string().max(10).optional().allow(null, ''),
  height: Joi.string().max(20).optional().allow(null, ''),
  weight: Joi.string().max(20).optional().allow(null, ''),
  gender: Joi.string().max(50).optional().allow(null, ''),
  emergencyName: Joi.string().max(255).optional().allow(null, ''),
  emergencyPhone: Joi.string().max(20).optional().allow(null, ''),
  emergencyRelationship: Joi.string().max(100).optional().allow(null, ''),
  medicalConditions: Joi.string().max(2000).optional().allow(null, ''),
  medications: Joi.string().max(2000).optional().allow(null, ''),
  injuriesSurgeries: Joi.string().max(2000).optional().allow(null, ''),
  allergies: Joi.string().max(2000).optional().allow(null, ''),
  fitnessLevel: Joi.string().max(100).optional().allow(null, ''),
  workedOutBefore: Joi.string().max(2000).optional().allow(null, ''),
  exerciseTypes: Joi.string().max(2000).optional().allow(null, ''),
  equipmentAccess: Joi.string().max(2000).optional().allow(null, ''),
  primaryGoal: Joi.string().max(2000).optional().allow(null, ''),
  secondaryGoals: Joi.string().max(2000).optional().allow(null, ''),
  targetTimeline: Joi.string().max(100).optional().allow(null, ''),
  sessionsPerWeek: Joi.string().max(50).optional().allow(null, ''),
  favoriteExercises: Joi.string().max(2000).optional().allow(null, ''),
  exercisesToAvoid: Joi.string().max(2000).optional().allow(null, ''),
  preferredSchedule: Joi.string().max(2000).optional().allow(null, ''),
  dietaryRestrictions: Joi.string().max(2000).optional().allow(null, ''),
  activityLevel: Joi.string().max(100).optional().allow(null, ''),
  sleepAverage: Joi.string().max(20).optional().allow(null, ''),
  daysPerWeek: Joi.string().max(50).optional().allow(null, ''),
  sessionsPerMonth: Joi.string().max(50).optional().allow(null, '')
});

// Validation function for user input
const validateUserInput = (data) => {
  return userSchema.validate(data, { abortEarly: false });
};

// Validation function for profile input
const validateProfileInput = (data) => {
  return profileSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateUserInput,
  validateProfileInput
};