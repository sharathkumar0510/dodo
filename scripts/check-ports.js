#!/usr/bin/env node

/**
 * Port checker utility script
 * 
 * This script checks if the standard ports for our applications are in use.
 * If a port is in use, it offers to kill the process using that port.
 * 
 * Usage:
 *   node check-ports.js [app-name]
 * 
 * Examples:
 *   node check-ports.js                # Check all ports
 *   node check-ports.js customer-app   # Check only customer app port
 */

const { exec } = require('child_process');
const readline = require('readline');
const portsConfig = require('../ports.config');
const util = require('util');
const execPromise = util.promisify(exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get the app name from command line arguments
const appArg = process.argv[2];

// Function to check if a port is in use
async function isPortInUse(port) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
      return stdout.trim().length > 0;
    } else {
      const { stdout } = await execPromise(`lsof -i:${port} -t`);
      return stdout.trim().length > 0;
    }
  } catch (error) {
    // If the command fails, the port is likely not in use
    return false;
  }
}

// Function to get the PID of the process using a port
async function getProcessOnPort(port) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
      const lines = stdout.trim().split('\n');
      if (lines.length > 0) {
        const parts = lines[0].trim().split(/\s+/);
        return parts[parts.length - 1];
      }
    } else {
      const { stdout } = await execPromise(`lsof -i:${port} -t`);
      return stdout.trim();
    }
  } catch (error) {
    return null;
  }
  return null;
}

// Function to kill a process by PID
async function killProcess(pid) {
  try {
    if (process.platform === 'win32') {
      await execPromise(`taskkill /F /PID ${pid}`);
    } else {
      await execPromise(`kill -9 ${pid}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to kill process ${pid}:`, error.message);
    return false;
  }
}

// Function to ask user for confirmation
function askForConfirmation(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Main function to check ports
async function checkPorts() {
  const portsToCheck = [];
  
  if (appArg) {
    try {
      const port = portsConfig.getPort(appArg);
      portsToCheck.push({ name: appArg, port });
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  } else {
    // Check all ports
    portsToCheck.push({ name: 'Customer App', port: portsConfig.CUSTOMER_APP_PORT });
    portsToCheck.push({ name: 'Vendor App', port: portsConfig.VENDOR_APP_PORT });
    portsToCheck.push({ name: 'Admin Panel', port: portsConfig.ADMIN_PANEL_PORT });
    portsToCheck.push({ name: 'Django Backend', port: portsConfig.DJANGO_BACKEND_PORT });
  }
  
  console.log('Checking standard ports for Dodo Services applications...\n');
  
  for (const { name, port } of portsToCheck) {
    process.stdout.write(`Checking ${name} port (${port})... `);
    
    const inUse = await isPortInUse(port);
    
    if (inUse) {
      console.log('IN USE');
      const pid = await getProcessOnPort(port);
      
      if (pid) {
        const shouldKill = await askForConfirmation(`Kill process ${pid} to free port ${port}? (y/n): `);
        
        if (shouldKill) {
          process.stdout.write(`Killing process ${pid}... `);
          const killed = await killProcess(pid);
          
          if (killed) {
            console.log('SUCCESS');
          } else {
            console.log('FAILED');
            console.log(`Please manually kill the process using port ${port} before starting ${name}.`);
          }
        } else {
          console.log(`Port ${port} will remain in use. ${name} may not start correctly.`);
        }
      }
    } else {
      console.log('AVAILABLE');
    }
  }
  
  rl.close();
}

// Run the main function
checkPorts().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
