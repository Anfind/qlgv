const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');

// Validation middleware cho tạo/cập nhật người dùng
const validateUser = [
    body('name')
        .notEmpty()
        .withMessage('Họ tên không được để trống')
        .isLength({ min: 2, max: 100 })
        .withMessage('Họ tên phải từ 2-100 ký tự'),
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('phoneNumber')
        .optional()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Số điện thoại không hợp lệ'),
    body('identity')
        .optional()
        .matches(/^[0-9]+$/)
        .withMessage('Số CCCD chỉ được chứa số')
        .isLength({ min: 9, max: 12 })
        .withMessage('Số CCCD phải từ 9-12 số'),
    body('dob')
        .optional()
        .isISO8601()
        .withMessage('Ngày sinh không hợp lệ'),
    body('role')
        .optional()
        .isIn(['STUDENT', 'TEACHER', 'ADMIN'])
        .withMessage('Vai trò không hợp lệ')
];

// Routes
// GET /api/users - Lấy danh sách tất cả người dùng
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Lấy thông tin chi tiết một người dùng
router.get('/:id', userController.getUserById);

// POST /api/users - Tạo người dùng mới
router.post('/', validateUser, userController.createUser);

// PUT /api/users/:id - Cập nhật thông tin người dùng
router.put('/:id', validateUser, userController.updateUser);

// DELETE /api/users/:id - Xóa mềm người dùng
router.delete('/:id', userController.deleteUser);

module.exports = router;
