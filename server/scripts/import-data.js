require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('../models/user.model');
const TeacherPosition = require('../models/teacherPosition.model');
const Teacher = require('../models/teacher.model');

const importData = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');

        // Đọc dữ liệu từ file JSON
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../sample/school.users.json'), 'utf-8'));
        const positionsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../sample/school.teacherpositions.json'), 'utf-8'));
        const teachersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../sample/school.teachers.json'), 'utf-8'));

        console.log(`📊 Found ${usersData.length} users, ${positionsData.length} positions, ${teachersData.length} teachers`);

        // Xóa dữ liệu cũ (nếu có)
        console.log('🗑️ Clearing existing data...');
        await User.deleteMany({});
        await TeacherPosition.deleteMany({});
        await Teacher.deleteMany({});

        // Import Users
        console.log('👥 Importing users...');
        const cleanedUsers = usersData
            .filter(user => user._id && user._id.$oid) // Lọc bỏ các object rỗng
            .map(user => ({
                _id: new mongoose.Types.ObjectId(user._id.$oid),
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                identity: user.identity,
                dob: user.dob ? new Date(user.dob.$date) : undefined,
                avatar: user.avatar,
                role: user.role || 'TEACHER',
                isDeleted: user.isDeleted || false,
                createdAt: user.createdAt ? new Date(user.createdAt.$date) : new Date(),
                updatedAt: user.updatedAt ? new Date(user.updatedAt.$date) : new Date()
            }));

        const insertedUsers = await User.insertMany(cleanedUsers);
        console.log(`✅ Imported ${insertedUsers.length} users`);

        // Import Teacher Positions
        console.log('📋 Importing teacher positions...');
        const cleanedPositions = positionsData
            .filter(position => position._id && position._id.$oid)
            .map(position => ({
                _id: new mongoose.Types.ObjectId(position._id.$oid),
                name: position.name,
                code: position.code,
                des: position.des,
                isActive: position.isActive !== undefined ? position.isActive : true,
                isDeleted: position.isDeleted || false,
                createdAt: position.createdAt ? new Date(position.createdAt.$date) : new Date(),
                updatedAt: position.updatedAt ? new Date(position.updatedAt.$date) : new Date()
            }));

        const insertedPositions = await TeacherPosition.insertMany(cleanedPositions);
        console.log(`✅ Imported ${insertedPositions.length} teacher positions`);

        // Import Teachers
        console.log('👨‍🏫 Importing teachers...');
        const cleanedTeachers = teachersData
            .filter(teacher => teacher._id && teacher._id.$oid && teacher.userId && teacher.userId.$oid)
            .map(teacher => ({
                _id: new mongoose.Types.ObjectId(teacher._id.$oid),
                userId: new mongoose.Types.ObjectId(teacher.userId.$oid),
                teacherPositionsId: teacher.teacherPositionsId ? 
                    teacher.teacherPositionsId.map(pos => new mongoose.Types.ObjectId(pos.$oid)) : [],
                isActive: teacher.isActive !== undefined ? teacher.isActive : true,
                isDeleted: teacher.isDeleted || false,
                code: teacher.code,
                startDate: teacher.startDate ? new Date(teacher.startDate.$date) : new Date(),
                endDate: teacher.endDate ? new Date(teacher.endDate.$date) : undefined,
                degrees: teacher.degrees || [],
                createdAt: teacher.createdAt ? new Date(teacher.createdAt.$date) : new Date(),
                updatedAt: teacher.updatedAt ? new Date(teacher.updatedAt.$date) : new Date()
            }));

        const insertedTeachers = await Teacher.insertMany(cleanedTeachers);
        console.log(`✅ Imported ${insertedTeachers.length} teachers`);

        // Hiển thị thống kê
        console.log('\n📈 Import Summary:');
        console.log(`👥 Users: ${insertedUsers.length}`);
        console.log(`📋 Teacher Positions: ${insertedPositions.length}`);
        console.log(`👨‍🏫 Teachers: ${insertedTeachers.length}`);

        // Kiểm tra dữ liệu đã import
        console.log('\n🔍 Verification:');
        const userCount = await User.countDocuments();
        const positionCount = await TeacherPosition.countDocuments();
        const teacherCount = await Teacher.countDocuments();
        
        console.log(`Database Users: ${userCount}`);
        console.log(`Database Positions: ${positionCount}`);
        console.log(`Database Teachers: ${teacherCount}`);

        console.log('\n🎉 Data import completed successfully!');

    } catch (error) {
        console.error('❌ Import failed:', error);
        if (error.code === 11000) {
            console.error('🔄 Duplicate key error - some data might already exist');
        }
    } finally {
        await mongoose.connection.close();
        console.log('🔒 Database connection closed');
        process.exit(0);
    }
};

console.log('🚀 Starting data import...');
importData();
