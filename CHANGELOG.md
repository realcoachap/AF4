# Changelog

All notable changes to Ascending Fitness v4 will be documented in this file.

## [4.1.1] - 2026-02-06

### Added
- Create dashboard page for logged-in users
- Create profile page to view user information
- Create edit-profile page for comprehensive profile management
- Add proper routing for dashboard, profile, and edit-profile pages
- Implement profile data loading and saving functionality
- Add comprehensive form fields for fitness and medical information
- Add conditional fields for dynamic form behavior
- Implement proper navigation between pages

### Changed
- Updated registration redirect to point to dashboard instead of non-existent pages
- Updated login redirect to point to dashboard consistently
- Enhanced server routing to handle multiple frontend pages
- Updated all HTML files to reflect new version 4.1.1

## [4.1.0] - 2026-02-06

### Added
- Configure Express server to serve static frontend files
- Set login page as default landing page when accessing Railway URL
- Proper routing for frontend files vs API endpoints

### Changed
- Updated server.js to serve frontend files from correct directory
- Modified catch-all route to serve login.html instead of 404 error
- Updated package.json version from 4.0.0 to 4.1.0

### Fixed
- Resolved issue where users couldn't access login page from Railway URL
- Corrected static file serving path to ../frontend instead of ./frontend

## [4.0.0] - 2026-02-05

### Added
- Complete authentication system with JWT tokens
- PostgreSQL database with connection pooling
- User and Profile models with comprehensive fields
- Role-based access control (client, trainer, admin)
- Secure registration and login functionality
- Frontend with login, registration, and landing pages
- Responsive CSS styling
- Input validation with Joi
- Security features (bcrypt, rate limiting, CORS)
- Database initialization and seeding scripts
- Comprehensive API endpoints
- README with setup instructions