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
        const userImports = [];
        
        for (let i = 0; i < usersData.length; i++) {
            const user = usersData[i];
            if (!user._id || !user._id.$oid) continue;
            
            // Generate email if missing
            let email = user.email;
            if (!email) {
                if (user.role === 'ADMIN') {
                    email = `admin${i + 1}@school.edu.vn`;
                } else if (user.role === 'TEACHER') {
                    email = `teacher${i + 1}@school.edu.vn`;
                } else {
                    email = `student${i + 1}@school.edu.vn`;
                }
                console.log(`📧 Generated email for ${user.name}: ${email}`);
            }
            
            userImports.push({
                _id: new mongoose.Types.ObjectId(user._id.$oid),
                name: user.name,
                email: email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                identity: user.identity,
                dob: user.dob ? new Date(user.dob.$date) : undefined,
                avatar: user.avatar,
                role: user.role || 'TEACHER',
                isDeleted: false, // Set to false to have test data
                createdAt: user.createdAt ? new Date(user.createdAt.$date) : new Date(),
                updatedAt: user.updatedAt ? new Date(user.updatedAt.$date) : new Date()
            });
        }

        const insertedUsers = await User.insertMany(userImports);
        console.log(`✅ Imported ${insertedUsers.length} users`);

        // Import Teacher Positions
        console.log('📋 Importing teacher positions...');
        const positionImports = positionsData
            .filter(position => position._id && position._id.$oid)
            .map(position => ({
                _id: new mongoose.Types.ObjectId(position._id.$oid),
                name: position.name,
                code: position.code,
                des: position.des,
                isActive: position.isActive !== undefined ? position.isActive : true,
                isDeleted: false, // Set to false to have test data
                createdAt: position.createdAt ? new Date(position.createdAt.$date) : new Date(),
                updatedAt: position.updatedAt ? new Date(position.updatedAt.$date) : new Date()
            }));

        const insertedPositions = await TeacherPosition.insertMany(positionImports);
        console.log(`✅ Imported ${insertedPositions.length} teacher positions`);

        // Import Teachers
        console.log('👨‍🏫 Importing teachers...');
        const teacherImports = teachersData
            .filter(teacher => teacher._id && teacher._id.$oid && teacher.userId && teacher.userId.$oid)
            .map(teacher => {
                // Clean degrees array to remove nested _id fields
                const cleanedDegrees = teacher.degrees ? teacher.degrees.map(degree => {
                    const { _id, ...cleanDegree } = degree;
                    return cleanDegree;
                }) : [];
                
                return {
                    _id: new mongoose.Types.ObjectId(teacher._id.$oid),
                    userId: new mongoose.Types.ObjectId(teacher.userId.$oid),
                    teacherPositionsId: teacher.teacherPositionsId ? 
                        teacher.teacherPositionsId.map(pos => new mongoose.Types.ObjectId(pos.$oid)) : [],
                    isActive: teacher.isActive !== undefined ? teacher.isActive : true,
                    isDeleted: false, // Set to false to have test data
                    code: teacher.code,
                    startDate: teacher.startDate ? new Date(teacher.startDate.$date) : new Date(),
                    endDate: teacher.endDate ? new Date(teacher.endDate.$date) : undefined,
                    degrees: cleanedDegrees,
                    createdAt: teacher.createdAt ? new Date(teacher.createdAt.$date) : new Date(),
                    updatedAt: teacher.updatedAt ? new Date(teacher.updatedAt.$date) : new Date()
                };
            });

        const insertedTeachers = await Teacher.insertMany(teacherImports);
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
