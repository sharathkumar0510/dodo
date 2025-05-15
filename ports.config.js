/**
 * Standard ports configuration for all applications in the Dodo Services platform.
 * 
 * IMPORTANT: Do not change these port numbers without updating all related documentation and configurations.
 * If a port is already in use, kill the existing process rather than using a different port.
 */

module.exports = {
  // Frontend applications
  CUSTOMER_APP_PORT: 3000,
  VENDOR_APP_PORT: 3001,
  ADMIN_PANEL_PORT: 3002,
  
  // Backend services
  DJANGO_BACKEND_PORT: 8000,
  
  // Development tools
  STORYBOOK_PORT: 6006,
  CYPRESS_PORT: 8080,
  
  // Utility function to get a port by application name
  getPort: function(appName) {
    const normalizedName = appName.toLowerCase().trim();
    
    switch(normalizedName) {
      case 'customer':
      case 'customer-app':
      case 'customerapp':
        return this.CUSTOMER_APP_PORT;
        
      case 'vendor':
      case 'vendor-app':
      case 'vendorapp':
        return this.VENDOR_APP_PORT;
        
      case 'admin':
      case 'admin-panel':
      case 'adminpanel':
        return this.ADMIN_PANEL_PORT;
        
      case 'backend':
      case 'django':
      case 'api':
        return this.DJANGO_BACKEND_PORT;
        
      case 'storybook':
        return this.STORYBOOK_PORT;
        
      case 'cypress':
      case 'e2e':
        return this.CYPRESS_PORT;
        
      default:
        throw new Error(`Unknown application name: ${appName}`);
    }
  }
};
