require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../models/user.model');
const TeacherPosition = require('../models/teacherPosition.model');
const Teacher = require('../models/teacher.model');

const viewData = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');

        // Lấy thống kê
        const userCount = await User.countDocuments();
        const positionCount = await TeacherPosition.countDocuments();
        const teacherCount = await Teacher.countDocuments();
        const activeTeachers = await Teacher.countDocuments({ isActive: true, isDeleted: false });

        console.log('\n📊 Database Statistics:');
        console.log(`👥 Total Users: ${userCount}`);
        console.log(`📋 Total Positions: ${positionCount}`);
        console.log(`👨‍🏫 Total Teachers: ${teacherCount}`);
        console.log(`✅ Active Teachers: ${activeTeachers}`);

        // Hiển thị một vài mẫu dữ liệu
        console.log('\n📋 Sample Teacher Positions:');
        const positions = await TeacherPosition.find({ isDeleted: false }).limit(5);
        positions.forEach(pos => {
            console.log(`- ${pos.code}: ${pos.name} (${pos.isActive ? 'Active' : 'Inactive'})`);
        });

        console.log('\n👥 Sample Users:');
        const users = await User.find({ role: 'TEACHER', isDeleted: false }).limit(5);
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email})`);
        });

        console.log('\n👨‍🏫 Sample Teachers with populated data:');
        const teachers = await Teacher.find({ isDeleted: false })
            .populate('userId')
            .populate('teacherPositionsId')
            .limit(3);
        
        teachers.forEach(teacher => {
            console.log(`- Code: ${teacher.code}`);
            console.log(`  Name: ${teacher.userId?.name || 'N/A'}`);
            console.log(`  Email: ${teacher.userId?.email || 'N/A'}`);
            console.log(`  Positions: ${teacher.teacherPositionsId.map(p => p.name).join(', ') || 'None'}`);
            console.log(`  Active: ${teacher.isActive ? 'Yes' : 'No'}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔒 Database connection closed');
        process.exit(0);
    }
};

console.log('🔍 Viewing database data...');
viewData();
