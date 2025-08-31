# KMUTT Project Backend

A robust Node.js backend API built with TypeScript, Express, and MongoDB for the KMUTT project. This application provides a scalable foundation for user management and other business operations.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **RESTful API**: Clean and intuitive API endpoints
- **Validation**: Request validation using class-validator
- **Error Handling**: Comprehensive error handling middleware
- **Logging**: Winston-based logging with daily rotation
- **Security**: Helmet, CORS, and other security middleware
- **Pagination**: Built-in pagination support for API responses
- **Auto-routing**: Automatic controller discovery using routing-controllers

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kmutt-proj-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create environment files based on your environment:
   
   **Development:**
   ```bash
   # .env.development.local
   NODE_ENV=development
   PORT=3000
   ROUTE_PREFIX=/api/v1
   LOG_DIR=logs
   LOG_FORMAT=combined
   DB_HOST=localhost
   DB_PORT=27017
   DB_DATABASE=kmutt_dev
   DB_USER=your_username
   DB_PASSWORD=your_password
   CREDENTIALS=true
   ORIGIN=http://localhost:3000
   ```

   **Production:**
   ```bash
   # .env.production.local
   NODE_ENV=production
   PORT=3000
   ROUTE_PREFIX=/api/v1
   LOG_DIR=logs
   LOG_FORMAT=combined
   DB_HOST=your_mongodb_host
   DB_PORT=27017
   DB_DATABASE=kmutt_prod
   DB_USER=your_username
   DB_PASSWORD=your_password
   CREDENTIALS=true
   ORIGIN=https://yourdomain.com
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### User Endpoints

#### Get All Users
```http
GET /user
```

**Query Parameters:**
- `limit` (number, optional): Number of users per page (default: 20)
- `page` (number, optional): Page number (default: 1)

**Response:**
```json
{
  "status": true,
  "info": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create User
```http
POST /user
```

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Email john.doe@example.com have sign-up successfully"
}
```

## 🏗️ Project Structure

```
src/
├── app.ts                 # Main application class
├── server.ts             # Server entry point
├── config/
│   └── index.ts          # Environment configuration
├── controllers/
│   └── user.controller.ts # User API controllers
├── databases/
│   └── index.ts          # Database connection configuration
├── dtos/
│   ├── pagination.dto.ts # Pagination data transfer objects
│   └── user.dto.ts       # User data transfer objects
├── exceptions/
│   └── HttpException.ts  # Custom HTTP exceptions
├── interfaces/
│   └── user.interface.ts # TypeScript interfaces
├── middlewares/
│   └── error.middleware.ts # Error handling middleware
├── models/
│   └── user.model.ts     # Mongoose models
├── services/
│   ├── main.service.ts   # Base service class
│   └── user.service.ts   # User business logic
├── types/
│   └── node-recursive-directory.d.ts # Type definitions
└── utils/
    ├── logger.ts         # Winston logger configuration
    ├── pagination.ts     # Pagination utilities
    └── validateEnv.ts    # Environment validation
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `3000` |
| `ROUTE_PREFIX` | API route prefix | `/api/v1` |
| `LOG_DIR` | Log directory | `logs` |
| `LOG_FORMAT` | Log format | `combined` |
| `DB_HOST` | MongoDB host | `localhost` |
| `DB_PORT` | MongoDB port | `27017` |
| `DB_DATABASE` | Database name | - |
| `DB_USER` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `CREDENTIALS` | CORS credentials | `true` |
| `ORIGIN` | CORS origin | - |

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run tests (not implemented yet) |

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **HPP**: HTTP Parameter Pollution protection
- **Compression**: Response compression
- **Input Validation**: Request validation using class-validator

## 📊 Logging

The application uses Winston for logging with the following features:

- **Daily rotation**: Log files are rotated daily
- **Multiple levels**: Error, warn, info, debug
- **Structured logging**: JSON format for better parsing
- **Separate directories**: Error and debug logs in separate folders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v1.0.0**: Initial release with user management functionality

---

**Built with ❤️ for KMUTT Project**
