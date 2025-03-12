# Kirppis - Company Internal Second-Hand Store

A web application for managing an internal second-hand store within a company, allowing employees to buy and sell items.

## Features

- User authentication and authorization
- Item listing and management
- Category organization
- Search and filtering capabilities
- Reservation system
- User profiles and history

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication

### Frontend (planned)
- React
- TypeScript
- Tailwind CSS

## Project Structure

```
kirppis/
├── server/             # Backend server
│   ├── src/
│   │   ├── config/     # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── middlewares/ # Express middlewares
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic
│   │   ├── types/      # TypeScript type definitions
│   │   ├── utils/      # Utility functions
│   │   └── index.ts    # Entry point
│   ├── package.json
│   └── tsconfig.json
├── client/             # Frontend (to be implemented)
├── .env                # Environment variables
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd kirppis
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env` (if available)
   - Update the values in `.env` file

4. Start MongoDB (if using local instance)
   ```bash
   mongod
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## API Endpoints

The API will be available at `http://localhost:5000/api/v1`

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Items
- `GET /api/v1/items` - Get all items
- `GET /api/v1/items/:id` - Get item by ID
- `POST /api/v1/items` - Create new item
- `PATCH /api/v1/items/:id` - Update item
- `DELETE /api/v1/items/:id` - Delete item

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create new category (admin only)
- `PATCH /api/v1/categories/:id` - Update category (admin only)
- `DELETE /api/v1/categories/:id` - Delete category (admin only)

## License

This project is licensed under the MIT License. 