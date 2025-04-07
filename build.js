// build.js - Special script to run during Vercel deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Log the current directory for debugging
console.log('Current directory:', process.cwd());

// Make sure the DATABASE_URL environment variable is set for Drizzle migrations
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set!');
  console.error('Please set up your environment variables in the Vercel dashboard.');
  process.exit(1);
}

try {
  // Run database migrations
  console.log('Running database migrations...');
  execSync('npm run db:push', { stdio: 'inherit' });

  // Build the backend
  console.log('Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Build the frontend
  console.log('Building frontend...');
  execSync('vite build', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}