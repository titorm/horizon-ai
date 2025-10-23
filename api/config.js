/**
 * Vercel Production Configuration
 * 
 * This file contains production-specific settings for the Vercel deployment.
 * It ensures optimal performance and security in the serverless environment.
 */

module.exports = {
  // Function regions - deploy close to your users
  regions: ['iad1'], // US East (change based on your user base)
  
  // Memory allocation (128, 256, 512, 1024, 3008 MB)
  memory: 1024,
  
  // Max duration (10s for Hobby, 60s for Pro, 900s for Enterprise)
  maxDuration: 10,
  
  // Environment variables
  env: {
    NODE_ENV: 'production',
  },
};
