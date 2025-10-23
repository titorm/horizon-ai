// Vercel Serverless Function Entry Point
// This file proxies all /api/* requests to the NestJS application

// Import the serverless handler from the built API
module.exports = require('../apps/api/dist/serverless').default;
