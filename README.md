# Ascending Fitness v4.0.0

Next-generation fitness platform with advanced security, scalability, and user experience.

## Features

- **Secure Authentication**: JWT-based authentication with refresh token rotation
- **Role-Based Access Control**: Different permissions for clients, trainers, and admins
- **Modern Tech Stack**: Node.js, PostgreSQL, React-ready API
- **Real-time Features**: WebSocket support for notifications
- **Mobile Responsive**: Fully responsive design
- **Extensible Architecture**: Easy to add new features and integrations

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi for input validation
- **Security**: Helmet, CORS, rate limiting
- **Frontend**: Vanilla HTML/CSS/JS (ready for React/Vue integration)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/realcoachap/AF4.git
cd AF4
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize the database:
```bash
npm run init-db
```

5. Seed initial data (optional):
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ascending_fitness_v4

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=24h

# Application
NODE_ENV=development
PORT=5000

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get own profile
- `PUT /api/users/me` - Update own profile
- `GET /api/users/:id` - Get user by ID (admin/trainer only)
- `PUT /api/users/:id` - Update user (admin/trainer only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Profiles
- `GET /api/profiles/me` - Get own profile
- `PUT /api/profiles/me` - Update own profile
- `GET /api/profiles/:userId` - Get user profile (admin/trainer only)
- `PUT /api/profiles/:userId` - Update user profile (admin/trainer only)

### Health
- `GET /api/health` - Health check
- `GET /api/health/database` - Database health check

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database tables
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- Rate limiting to prevent abuse
- Helmet.js for HTTP security headers
- CORS configured for security
- SQL injection prevention

## Database Schema

### Users Table
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(255) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password`: VARCHAR(255) NOT NULL
- `phone`: VARCHAR(20)
- `role`: VARCHAR(50) DEFAULT 'client'
- `verified`: BOOLEAN DEFAULT FALSE
- `refresh_token`: VARCHAR(510)
- `verification_token`: VARCHAR(255)
- `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

### Profiles Table
- `user_id`: INTEGER PRIMARY KEY REFERENCES users(id)
- `age`: VARCHAR(10)
- `height`: VARCHAR(20)
- `weight`: VARCHAR(20)
- `gender`: VARCHAR(50)
- `emergency_name`: VARCHAR(255)
- `emergency_phone`: VARCHAR(20)
- `emergency_relationship`: VARCHAR(100)
- `medical_conditions`: TEXT
- `medications`: TEXT
- `injuries_surgeries`: TEXT
- `allergies`: TEXT
- `fitness_level`: VARCHAR(100)
- `worked_out_before`: TEXT
- `exercise_types`: TEXT
- `equipment_access`: TEXT
- `primary_goal`: TEXT
- `secondary_goals`: TEXT
- `target_timeline`: VARCHAR(100)
- `sessions_per_week`: VARCHAR(50)
- `favorite_exercises`: TEXT
- `exercises_to_avoid`: TEXT
- `preferred_schedule`: TEXT
- `dietary_restrictions`: TEXT
- `activity_level`: VARCHAR(100)
- `sleep_average`: VARCHAR(20)
- `days_per_week`: VARCHAR(50)
- `sessions_per_month`: VARCHAR(50)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.