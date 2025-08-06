require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../models/user.model');
const TeacherPosition = require('../models/teacherPosition.model');
const Teacher = require('../models/teacher.model');

const resetDeletedFlags = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');

        // Reset isDeleted = false cho tất cả records
        console.log('🔄 Resetting isDeleted flags...');
        
        const userResult = await User.updateMany({}, { isDeleted: false });
        const positionResult = await TeacherPosition.updateMany({}, { isDeleted: false });
        const teacherResult = await Teacher.updateMany({}, { isDeleted: false });

        console.log(`✅ Updated ${userResult.modifiedCount} users`);
        console.log(`✅ Updated ${positionResult.modifiedCount} positions`);
        console.log(`✅ Updated ${teacherResult.modifiedCount} teachers`);

        // Hiển thị thống kê sau khi reset
        const activeUsers = await User.countDocuments({ isDeleted: false });
        const activePositions = await TeacherPosition.countDocuments({ isDeleted: false });
        const activeTeachers = await Teacher.countDocuments({ isDeleted: false });

        console.log('\n📊 Active Records:');
        console.log(`👥 Active Users: ${activeUsers}`);
        console.log(`📋 Active Positions: ${activePositions}`);
        console.log(`👨‍🏫 Active Teachers: ${activeTeachers}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔒 Database connection closed');
        process.exit(0);
    }
};

console.log('🔄 Resetting deleted flags...');
resetDeletedFlags();
