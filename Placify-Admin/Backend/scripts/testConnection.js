const mongoose = require('mongoose');
require('dotenv').config();

// Simple MongoDB connection test
async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('   URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/placify');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placify', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ MongoDB connection successful!');
    
    // Test a simple operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📋 Available collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // Check if experiences collection exists
    const experiencesExists = collections.some(col => col.name === 'experiences');
    
    if (experiencesExists) {
      // Try to count documents
      const count = await db.collection('experiences').countDocuments();
      console.log(`📊 Experiences collection has ${count} documents`);
    } else {
      console.log('⚠️  Experiences collection does not exist yet');
      console.log('   This is normal if no user experiences have been submitted');
    }

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n🔥 MongoDB is not running!');
      console.error('🚀 Start MongoDB with:');
      console.error('   Windows: net start MongoDB');
      console.error('   macOS/Linux: sudo systemctl start mongod');
      console.error('   Manual: mongod --dbpath /path/to/data\n');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connection closed');
  }
}

// Add to package.json scripts
console.log('MongoDB Connection Test');
console.log('======================');
testConnection();