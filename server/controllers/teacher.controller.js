const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');
const TeacherPosition = require('../models/teacherPosition.model');
const { validationResult } = require('express-validator');

// Lấy danh sách tất cả giáo viên
exports.getAllTeachers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        
        // Tạo query tìm kiếm
        let searchQuery = { isDeleted: false };
        
        const teachers = await Teacher.find(searchQuery)
            .populate({
                path: 'userId',
                match: search ? { 
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } }
                    ]
                } : {}
            })
            .populate('teacherPositionsId')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Lọc bỏ những teacher có userId null (do không match search)
        const filteredTeachers = teachers.filter(teacher => teacher.userId !== null);

        const total = await Teacher.countDocuments(searchQuery);

        res.status(200).json({
            success: true,
            data: {
                teachers: filteredTeachers,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Lấy danh sách giáo viên thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách giáo viên',
            error: error.message
        });
    }
};

// Lấy thông tin chi tiết một giáo viên
exports.getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findOne({ _id: id, isDeleted: false })
            .populate('userId')
            .populate('teacherPositionsId');

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giáo viên'
            });
        }

        res.status(200).json({
            success: true,
            data: teacher,
            message: 'Lấy thông tin giáo viên thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin giáo viên',
            error: error.message
        });
    }
};

// Tạo giáo viên mới
exports.createTeacher = async (req, res) => {
    try {
        // Kiểm tra validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob,
            teacherPositionsId,
            degrees,
            startDate,
            endDate
        } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }

        // Tạo user mới
        const newUser = new User({
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob: dob ? new Date(dob) : undefined,
            role: 'TEACHER'
        });

        const savedUser = await newUser.save();

        // Tạo teacher mới
        const newTeacher = new Teacher({
            userId: savedUser._id,
            teacherPositionsId: teacherPositionsId || [],
            degrees: degrees || [],
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : undefined
        });

        const savedTeacher = await newTeacher.save();

        // Populate dữ liệu để trả về
        const populatedTeacher = await Teacher.findById(savedTeacher._id)
            .populate('userId')
            .populate('teacherPositionsId');

        res.status(201).json({
            success: true,
            data: populatedTeacher,
            message: 'Tạo giáo viên thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo giáo viên',
            error: error.message
        });
    }
};

// Cập nhật thông tin giáo viên
exports.updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob,
            teacherPositionsId,
            degrees,
            startDate,
            endDate,
            isActive
        } = req.body;

        // Tìm giáo viên
        const teacher = await Teacher.findOne({ _id: id, isDeleted: false })
            .populate('userId');
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giáo viên'
            });
        }

        // Kiểm tra email có bị trùng không (ngoại trừ chính user này)
        if (email !== teacher.userId.email) {
            const existingUser = await User.findOne({ 
                email, 
                isDeleted: false,
                _id: { $ne: teacher.userId._id }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }
        }

        // Cập nhật thông tin user
        await User.findByIdAndUpdate(teacher.userId._id, {
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob: dob ? new Date(dob) : undefined
        });

        // Cập nhật thông tin teacher
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            {
                teacherPositionsId: teacherPositionsId || [],
                degrees: degrees || [],
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                isActive: isActive !== undefined ? isActive : teacher.isActive
            },
            { new: true }
        ).populate('userId').populate('teacherPositionsId');

        res.status(200).json({
            success: true,
            data: updatedTeacher,
            message: 'Cập nhật thông tin giáo viên thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật giáo viên',
            error: error.message
        });
    }
};

// Xóa mềm giáo viên
exports.deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findOne({ _id: id, isDeleted: false });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giáo viên'
            });
        }

        // Xóa mềm cả teacher và user
        await Teacher.findByIdAndUpdate(id, { isDeleted: true });
        await User.findByIdAndUpdate(teacher.userId, { isDeleted: true });

        res.status(200).json({
            success: true,
            message: 'Xóa giáo viên thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa giáo viên',
            error: error.message
        });
    }
};

// Thống kê giáo viên
exports.getTeacherStats = async (req, res) => {
    try {
        const totalTeachers = await Teacher.countDocuments({ isDeleted: false });
        const activeTeachers = await Teacher.countDocuments({ isDeleted: false, isActive: true });
        const inactiveTeachers = await Teacher.countDocuments({ isDeleted: false, isActive: false });

        res.status(200).json({
            success: true,
            data: {
                total: totalTeachers,
                active: activeTeachers,
                inactive: inactiveTeachers
            },
            message: 'Lấy thống kê giáo viên thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thống kê giáo viên',
            error: error.message
        });
    }
};
