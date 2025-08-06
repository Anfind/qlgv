// node scripts/test-connection.js to test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('🌐 Connecting to:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas connection successful!');
    
    // Test database operations
    const ping = await mongoose.connection.db.admin().ping();
    console.log('📊 Database ping result:', ping);
    
    // Get database info
    const dbName = mongoose.connection.name;
    console.log('📚 Connected to database:', dbName);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(col => col.name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes('authentication')) {
      console.error('🔐 Check your username/password in the connection string');
    }
    if (error.message.includes('network')) {
      console.error('🌐 Check your internet connection');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    process.exit(0);
  }
};

console.log('🚀 Starting MongoDB Atlas connection test...');
testConnection();
