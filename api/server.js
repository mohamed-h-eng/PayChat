import app from './index.js';
import { connectDatabase } from '../backend/config/db.js';
import { env } from '../backend/config/env.js';

async function startServer() {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Backend server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend server:', error);
    process.exit(1);
  }
}

startServer();
