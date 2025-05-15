#!/usr/bin/env node

/**
 * Start script for Customer App
 * 
 * This script ensures the Customer App starts on its standard port.
 * It checks if the port is in use and offers to kill the process if needed.
 */

const { spawn } = require('child_process');
const path = require('path');
const { CUSTOMER_APP_PORT } = require('../ports.config');

// First, run the port checker
const portChecker = spawn('node', [path.join(__dirname, 'check-ports.js'), 'customer-app'], {
  stdio: 'inherit'
});

portChecker.on('close', (code) => {
  if (code !== 0) {
    console.error('Port check failed. Please resolve port conflicts manually.');
    process.exit(1);
  }
  
  console.log(`\nStarting Customer App on port ${CUSTOMER_APP_PORT}...\n`);
  
  // Start the Next.js app with the specified port
  const nextApp = spawn('npm', ['run', 'dev', '--', `-p ${CUSTOMER_APP_PORT}`], {
    cwd: path.join(__dirname, '../frontend/customer-app'),
    stdio: 'inherit',
    shell: true
  });
  
  nextApp.on('error', (error) => {
    console.error('Failed to start Customer App:', error);
    process.exit(1);
  });
  
  // Forward signals to the child process
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      nextApp.kill(signal);
    });
  });
});
