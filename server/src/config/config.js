// Configuration for the Neshama server
// In production, use environment variables instead of hardcoded values

module.exports = {
  // MongoDB Atlas connection string
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://shoambe_db_user:Kia3619!@neshama.qyl8vmj.mongodb.net/neshama?retryWrites=true&w=majority&appName=neshama',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'neshama-jwt-secret-key-2024-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Server port
  PORT: process.env.PORT || 5000,
};

