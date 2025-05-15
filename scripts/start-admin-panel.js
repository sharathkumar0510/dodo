#!/usr/bin/env node

/**
 * Start script for Admin Panel
 * 
 * This script ensures the Admin Panel starts on its standard port.
 * It checks if the port is in use and offers to kill the process if needed.
 */

const { spawn } = require('child_process');
const path = require('path');
const { ADMIN_PANEL_PORT } = require('../ports.config');

// First, run the port checker
const portChecker = spawn('node', [path.join(__dirname, 'check-ports.js'), 'admin-panel'], {
  stdio: 'inherit'
});

portChecker.on('close', (code) => {
  if (code !== 0) {
    console.error('Port check failed. Please resolve port conflicts manually.');
    process.exit(1);
  }
  
  console.log(`\nStarting Admin Panel on port ${ADMIN_PANEL_PORT}...\n`);
  
  // Start the Next.js app with the specified port
  const nextApp = spawn('npm', ['run', 'dev', '--', `-p ${ADMIN_PANEL_PORT}`], {
    cwd: path.join(__dirname, '../frontend/admin-panel'),
    stdio: 'inherit',
    shell: true
  });
  
  nextApp.on('error', (error) => {
    console.error('Failed to start Admin Panel:', error);
    process.exit(1);
  });
  
  // Forward signals to the child process
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      nextApp.kill(signal);
    });
  });
});
