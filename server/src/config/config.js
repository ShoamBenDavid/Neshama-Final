// Configuration for the Neshama server
// In production, use environment variables instead of hardcoded values

module.exports = {
  // MongoDB Atlas connection string
  // Remove quotes if present in env variable
  MONGODB_URI: (process.env.MONGODB_URI || 'mongodb://localhost:27017/neshama').replace(/^["']|["']$/g, ''),
  
  // JWT configuration
  JWT_SECRET: (process.env.JWT_SECRET || 'your-secret-key-change-in-production').replace(/^["']|["']$/g, ''),
  JWT_EXPIRE: (process.env.JWT_EXPIRE || '30d').replace(/^["']|["']$/g, ''),
  
  // Server port - convert string to number
  PORT: 5000,
};

