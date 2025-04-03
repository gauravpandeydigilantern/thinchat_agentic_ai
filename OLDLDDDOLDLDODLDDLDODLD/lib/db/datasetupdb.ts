import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// import dotenv from 'dotenv';

// dotenv.config();

const AGENT_AI_URL = process.env.AGENT_AI_URL;

if (!AGENT_AI_URL) {
  throw new Error('AGENT_AI_URL environment variable is not set');
}

// Create a connection pool with recommended options
export const sql = postgres(AGENT_AI_URL, {
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 10, // Close idle connections after 10 seconds
  connection: {
    application_name: 'my-app', // Set application name for monitoring
  },
});

export const dba = drizzle(sql);


async function testConnection() {
  try {
    await sql`SELECT 1`; // Simple query to check connection
    console.log('Database connected successfully123');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit process if connection fails
  }
}

testConnection();