# Bitespeed Identity Reconciliation

A Node.js backend project with TypeScript, Express, and Prisma for PostgreSQL database.

## Features

- **TypeScript**: Full TypeScript support with strict mode
- **Express.js**: Fast, unopinionated web framework
- **Prisma**: Modern database toolkit for PostgreSQL
- **Jest**: Testing framework with coverage reporting
- **Zod**: TypeScript-first schema validation
- **Environment Configuration**: Secure environment variable management

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bitespeed-identity-reconciliation
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Update the `.env` file with your database configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
PORT=3000
NODE_ENV=development
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

6. Run database migrations:
```bash
npm run prisma:migrate
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Run database seed script

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # Route definitions
├── middleware/      # Express middleware
├── tests/           # Test files
└── index.ts         # Application entry point

prisma/
└── schema.prisma    # Database schema

dist/                # Compiled JavaScript (generated)
```

## API Endpoints

### Health Check
- `GET /health` - Check server health status

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Database

This project uses Prisma with PostgreSQL. The database schema is defined in `prisma/schema.prisma`.

To view and manage your database with Prisma Studio:
```bash
npm run prisma:studio
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT 