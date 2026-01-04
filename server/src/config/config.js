// Configuration for the Neshama server
// In production, use environment variables instead of hardcoded values

module.exports = {
  // MongoDB Atlas connection string
  MONGODB_URI: process.env.MONGODB_URI ,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET ,
  JWT_EXPIRE: process.env.JWT_EXPIRE ,
  
  // Server port
  PORT: process.env.PORT ,
};

