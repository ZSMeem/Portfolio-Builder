import { initDatabase } from '../lib/db.js';

async function initialize() {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initialize();