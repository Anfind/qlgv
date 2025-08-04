const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const teacherController = require('../controllers/teacher.controller');

// Validation middleware cho tạo/cập nhật giáo viên
const validateTeacher = [
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
    body('teacherPositionsId')
        .optional()
        .isArray()
        .withMessage('Vị trí công tác phải là một mảng'),
    body('teacherPositionsId.*')
        .optional()
        .isMongoId()
        .withMessage('ID vị trí công tác không hợp lệ'),
    body('degrees')
        .optional()
        .isArray()
        .withMessage('Học vị phải là một mảng'),
    body('degrees.*.type')
        .optional()
        .notEmpty()
        .withMessage('Bậc học không được để trống'),
    body('degrees.*.school')
        .optional()
        .notEmpty()
        .withMessage('Trường học không được để trống'),
    body('degrees.*.major')
        .optional()
        .notEmpty()
        .withMessage('Chuyên ngành không được để trống'),
    body('degrees.*.year')
        .optional()
        .isInt({ min: 1950, max: new Date().getFullYear() })
        .withMessage('Năm tốt nghiệp không hợp lệ'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Ngày bắt đầu không hợp lệ'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Ngày kết thúc không hợp lệ')
];

// Routes
// GET /api/teachers - Lấy danh sách tất cả giáo viên
router.get('/', teacherController.getAllTeachers);

// GET /api/teachers/stats - Thống kê giáo viên
router.get('/stats', teacherController.getTeacherStats);

// GET /api/teachers/:id - Lấy thông tin chi tiết một giáo viên
router.get('/:id', teacherController.getTeacherById);

// POST /api/teachers - Tạo giáo viên mới
router.post('/', validateTeacher, teacherController.createTeacher);

// PUT /api/teachers/:id - Cập nhật thông tin giáo viên
router.put('/:id', validateTeacher, teacherController.updateTeacher);

// DELETE /api/teachers/:id - Xóa mềm giáo viên
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
