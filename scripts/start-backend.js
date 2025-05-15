#!/usr/bin/env node

/**
 * Start script for Django Backend
 * 
 * This script ensures the Django Backend starts on its standard port.
 * It checks if the port is in use and offers to kill the process if needed.
 */

const { spawn } = require('child_process');
const path = require('path');
const { DJANGO_BACKEND_PORT } = require('../ports.config');

// First, run the port checker
const portChecker = spawn('node', [path.join(__dirname, 'check-ports.js'), 'backend'], {
  stdio: 'inherit'
});

portChecker.on('close', (code) => {
  if (code !== 0) {
    console.error('Port check failed. Please resolve port conflicts manually.');
    process.exit(1);
  }
  
  console.log(`\nStarting Django Backend on port ${DJANGO_BACKEND_PORT}...\n`);
  
  // Start the Django server with the specified port
  const djangoServer = spawn('python', ['manage.py', 'runserver', `0.0.0.0:${DJANGO_BACKEND_PORT}`], {
    cwd: path.join(__dirname, '../backend'),
    stdio: 'inherit',
    shell: true
  });
  
  djangoServer.on('error', (error) => {
    console.error('Failed to start Django Backend:', error);
    process.exit(1);
  });
  
  // Forward signals to the child process
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      djangoServer.kill(signal);
    });
  });
});
