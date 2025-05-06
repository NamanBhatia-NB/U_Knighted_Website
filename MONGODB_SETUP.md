# Chess Society Website - MongoDB Version

This guide explains how to set up and run the Chess Society Website using MongoDB instead of PostgreSQL.

## Prerequisites

- Node.js (v16 or later)
- npm (included with Node.js)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Install MongoDB (if using locally)

#### Windows:
- Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
- Follow the installation wizard
- MongoDB should be running as a service after installation

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/chess_society
PORT=5000
```

If using MongoDB Atlas, replace the MONGO_URI with your connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chess_society?retryWrites=true&w=majority
```

### 3. Install Dependencies

First, update your package.json to include MongoDB dependencies:

```bash
# Option 1: Replace the entire package.json
cp mongo-package.json package.json
npm install

# Option 2: Just install the MongoDB package
npm install mongoose dotenv
```

### 4. Seed the Database

Populate your MongoDB database with initial data:

```bash
node db/seed.js
```

### 5. Start the Application

Run the application with the MongoDB configuration:

```bash
node server/index-mongo.js
```

The application should now be running at http://localhost:5000

## Project Structure

- `models/index.js`: MongoDB schemas and models
- `db/mongoose.js`: MongoDB connection setup
- `db/seed.js`: Database seeding script
- `server/routes-mongo.js`: API routes using MongoDB
- `server/index-mongo.js`: Main server file

## Accessing MongoDB Data

You can view and manage your MongoDB data using MongoDB Compass, a GUI tool available at https://www.mongodb.com/products/compass

## Troubleshooting

- **Connection Issues**: Make sure MongoDB is running and accessible. Check your MONGO_URI in the .env file.
- **Port Conflicts**: If port 5000 is already in use, change the PORT value in your .env file.
- **Missing Models**: Ensure all models are properly defined in models/index.js.