const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search = '' } = req.query;
        
        let query = { isDeleted: false };
        
        // Lọc theo role nếu có
        if (role) {
            query.role = role;
        }
        
        // Tìm kiếm theo tên, email, số điện thoại
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Lấy danh sách người dùng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách người dùng',
            error: error.message
        });
    }
};

// Lấy thông tin chi tiết một người dùng
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id, isDeleted: false });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'Lấy thông tin người dùng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin người dùng',
            error: error.message
        });
    }
};

// Tạo người dùng mới
exports.createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }

        const { name, email, phoneNumber, address, identity, dob, role } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }

        const newUser = new User({
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob: dob ? new Date(dob) : undefined,
            role: role || 'STUDENT'
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            data: savedUser,
            message: 'Tạo người dùng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo người dùng',
            error: error.message
        });
    }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phoneNumber, address, identity, dob, role } = req.body;

        const user = await User.findOne({ _id: id, isDeleted: false });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Kiểm tra email có bị trùng không
        if (email !== user.email) {
            const existingUser = await User.findOne({ 
                email, 
                isDeleted: false,
                _id: { $ne: id }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phoneNumber,
                address,
                identity,
                dob: dob ? new Date(dob) : undefined,
                role
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'Cập nhật thông tin người dùng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật người dùng',
            error: error.message
        });
    }
};

// Xóa mềm người dùng
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id, isDeleted: false });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        await User.findByIdAndUpdate(id, { isDeleted: true });

        res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa người dùng',
            error: error.message
        });
    }
};
