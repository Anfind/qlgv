const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const teacherPositionController = require('../controllers/teacherPosition.controller');

// Validation middleware cho tạo/cập nhật vị trí công tác
const validatePosition = [
    body('name')
        .notEmpty()
        .withMessage('Tên vị trí công tác không được để trống')
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên vị trí công tác phải từ 2-100 ký tự'),
    body('code')
        .notEmpty()
        .withMessage('Mã vị trí không được để trống')
        .isLength({ min: 2, max: 20 })
        .withMessage('Mã vị trí phải từ 2-20 ký tự')
        .matches(/^[A-Z0-9_]+$/)
        .withMessage('Mã vị trí chỉ được chứa chữ hoa, số và dấu gạch dưới'),
    body('des')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Mô tả không được vượt quá 500 ký tự'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Trạng thái phải là true hoặc false')
];

// Routes
// GET /api/positions - Lấy danh sách tất cả vị trí công tác
router.get('/', teacherPositionController.getAllPositions);

// GET /api/positions/:id - Lấy thông tin chi tiết một vị trí công tác
router.get('/:id', teacherPositionController.getPositionById);

// POST /api/positions - Tạo vị trí công tác mới
router.post('/', validatePosition, teacherPositionController.createPosition);

// PUT /api/positions/:id - Cập nhật vị trí công tác
router.put('/:id', validatePosition, teacherPositionController.updatePosition);

// DELETE /api/positions/:id - Xóa mềm vị trí công tác
router.delete('/:id', teacherPositionController.deletePosition);

module.exports = router;
