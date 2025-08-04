const TeacherPosition = require('../models/teacherPosition.model');
const { validationResult } = require('express-validator');

// Lấy danh sách tất cả vị trí công tác
exports.getAllPositions = async (req, res) => {
    try {
        const positions = await TeacherPosition.find({ isDeleted: false })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: positions,
            message: 'Lấy danh sách vị trí công tác thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách vị trí công tác',
            error: error.message
        });
    }
};

// Tạo vị trí công tác mới
exports.createPosition = async (req, res) => {
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

        const { name, code, des, isActive } = req.body;

        // Kiểm tra mã vị trí đã tồn tại
        const existingPosition = await TeacherPosition.findOne({ code, isDeleted: false });
        if (existingPosition) {
            return res.status(400).json({
                success: false,
                message: 'Mã vị trí công tác đã tồn tại'
            });
        }

        const newPosition = new TeacherPosition({
            name,
            code,
            des,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedPosition = await newPosition.save();

        res.status(201).json({
            success: true,
            data: savedPosition,
            message: 'Tạo vị trí công tác thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo vị trí công tác',
            error: error.message
        });
    }
};

// Cập nhật vị trí công tác
exports.updatePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, des, isActive } = req.body;

        // Kiểm tra vị trí công tác có tồn tại
        const position = await TeacherPosition.findOne({ _id: id, isDeleted: false });
        if (!position) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy vị trí công tác'
            });
        }

        // Kiểm tra mã vị trí có bị trùng không (ngoại trừ chính nó)
        if (code !== position.code) {
            const existingPosition = await TeacherPosition.findOne({ 
                code, 
                isDeleted: false,
                _id: { $ne: id }
            });
            if (existingPosition) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã vị trí công tác đã tồn tại'
                });
            }
        }

        const updatedPosition = await TeacherPosition.findByIdAndUpdate(
            id,
            { name, code, des, isActive },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedPosition,
            message: 'Cập nhật vị trí công tác thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật vị trí công tác',
            error: error.message
        });
    }
};

// Xóa mềm vị trí công tác
exports.deletePosition = async (req, res) => {
    try {
        const { id } = req.params;

        const position = await TeacherPosition.findOne({ _id: id, isDeleted: false });
        if (!position) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy vị trí công tác'
            });
        }

        await TeacherPosition.findByIdAndUpdate(id, { isDeleted: true });

        res.status(200).json({
            success: true,
            message: 'Xóa vị trí công tác thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa vị trí công tác',
            error: error.message
        });
    }
};

// Lấy thông tin chi tiết một vị trí công tác
exports.getPositionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const position = await TeacherPosition.findOne({ _id: id, isDeleted: false });
        if (!position) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy vị trí công tác'
            });
        }

        res.status(200).json({
            success: true,
            data: position,
            message: 'Lấy thông tin vị trí công tác thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin vị trí công tác',
            error: error.message
        });
    }
};
