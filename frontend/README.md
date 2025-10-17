# Next.js Frontend with FastAPI Backend Integration

This project demonstrates a modern full-stack application that integrates a Next.js frontend with a FastAPI backend. The application features a stylish UI built with Tailwind CSS and Framer Motion animations, along with a robust authentication system using JWT tokens.

## Project Structure

- **Frontend**: Next.js app with Tailwind CSS for styling and Framer Motion for animations
- **Backend**: FastAPI with JWT authentication and SQLAlchemy for database operations
- **Authentication**: JWT-based auth with protected routes and server-side validation

## Features

- **User Authentication**: Complete login/signup system with JWT
- **Protected Routes**: Middleware to prevent unauthorized access
- **Social Media Style UI**: Post creation, commenting, and user interactions
- **Profile Management**: User profile viewing and editing
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ (or Docker)
- Python 3.8+ (for backend)
- Docker and Docker Compose (optional, for containerized setup)

### Using Docker

#### Production Build

1. Build and run the Docker container:

```bash
docker-compose up --build
```

2. Access the application at http://localhost:3000

#### Development Mode

1. Run the development container:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

2. Access the application with hot-reloading at http://localhost:3000

### Manual Setup

1. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend API will be available at [http://localhost:8000](http://localhost:8000).

## API Integration

The frontend connects to the FastAPI backend using axios. The API utilities are organized in the `app/lib/api-utils.ts` file, which includes:

- Authentication endpoints (login, register, profile)
- Post management (create, read, update, delete)
- Comment functionality (add, edit, delete)

The authentication system uses JWT tokens stored in cookies for persistent sessions and protected routes.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development Notes

- The project includes fallback sample data in the `data/` directory for development without the backend
- API calls automatically fallback to sample data if the backend is unavailable
- Protected routes redirect to login when accessing without authentication
