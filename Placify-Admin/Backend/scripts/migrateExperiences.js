const mongoose = require('mongoose');
require('dotenv').config();

// Configure mongoose with longer timeouts
mongoose.set('bufferCommands', false);

// Migration script to update existing experiences with admin moderation fields

async function migrateExperiences() {
  try {
    console.log('🔄 Starting Experience collection migration...');

    // Check if MongoDB is running by attempting connection
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('   URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/placify');

    // Connect to MongoDB with extended timeout and connection options
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placify', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 5,
      retryWrites: true,
    });

    console.log('✅ Connected to MongoDB');

    // Get Experience model from user backend
    const Experience = require('../../../Placify-Users/Backend/src/models/Experience');

    console.log('📋 Checking current database state...');

    // Use native driver to avoid Mongoose buffering issues
    const db = mongoose.connection.db;
    const experiencesCollection = db.collection('experiences');
    
    // Use estimatedDocumentCount which is faster for large collections
    const totalCount = await experiencesCollection.estimatedDocumentCount();
    console.log(`📊 Total experiences found: ${totalCount}`);

    // Count documents that need migration using native driver
    const needsMigrationCount = await experiencesCollection.countDocuments({
      status: { $exists: false }
    });

    console.log(`🔧 Experiences needing migration: ${needsMigrationCount}`);

    if (needsMigrationCount === 0) {
      console.log('✅ All experiences are already migrated!');
      return;
    }

    // Migrate existing experiences using native driver for better performance
    const migrationResult = await experiencesCollection.updateMany(
      { status: { $exists: false } }, // Only update documents without status field
      {
        $set: {
          status: 'approved', // Set existing experiences as approved
          verificationBadge: false,
          moderatedBy: 'migration-script',
          moderationNotes: 'Auto-approved during migration - existing experience',
          approvedAt: new Date()
        }
      }
    );

    console.log(`✅ Migration completed successfully!`);
    console.log(`📈 Documents modified: ${migrationResult.modifiedCount}`);
    console.log(`📈 Documents matched: ${migrationResult.matchedCount}`);

    // Verify migration using native driver
    const verifyCount = await experiencesCollection.countDocuments({
      status: { $exists: true }
    });

    console.log(`🔍 Verification: ${verifyCount}/${totalCount} documents have status field`);

    // Show status distribution using native aggregation
    const statusDistribution = await experiencesCollection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log('📊 Status distribution after migration:');
    statusDistribution.forEach(item => {
      console.log(`   ${item._id}: ${item.count}`);
    });

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n🔥 MongoDB Connection Error:');
      console.error('   MongoDB server is not running or not accessible.');
      console.error('\n🚀 To fix this:');
      console.error('   1. Start MongoDB service:');
      console.error('      - Windows: net start MongoDB');
      console.error('      - macOS/Linux: sudo systemctl start mongod');
      console.error('      - Or run: mongod --dbpath /path/to/your/data');
      console.error('   2. Or install MongoDB if not installed');
      console.error('   3. Verify MongoDB is running on port 27017');
    } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
      console.error('\n⏱️ Database Timeout Error:');
      console.error('   The database operation took too long.');
      console.error('\n🚀 To fix this:');
      console.error('   1. Check if MongoDB is running properly');
      console.error('   2. Verify network connectivity');
      console.error('   3. Check if the database is too large');
      console.error('   4. Try running migration again');
    } else {
      console.error('\n🔍 Migration Error Details:');
      console.error('   ', error);
    }
    
    throw error;
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Add helper function to rollback migration if needed
async function rollbackMigration() {
  try {
    console.log('⚠️  Starting migration rollback...');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placify', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const Experience = require('../../../Placify-Users/Backend/src/models/Experience');

    // Remove migration fields
    const rollbackResult = await Experience.updateMany(
      { moderatedBy: 'migration-script' }, // Only rollback migration-created entries
      {
        $unset: {
          status: '',
          verificationBadge: '',
          moderatedBy: '',
          moderationNotes: '',
          approvedAt: '',
          rejectedAt: ''
        }
      }
    );

    console.log(`✅ Rollback completed! Modified: ${rollbackResult.modifiedCount} documents`);

  } catch (error) {
    console.error('❌ Rollback failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'rollback') {
  rollbackMigration();
} else {
  migrateExperiences();
}

// Export functions for manual use
module.exports = {
  migrateExperiences,
  rollbackMigration
};