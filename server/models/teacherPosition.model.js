const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherPositionSchema = new Schema({
    name: { type: String, required: true }, // Tên vị trí công tác
    code: { type: String, required: true, unique: true }, // Mã vị trí
    des: { type: String }, // Mô tả
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const TeacherPosition = mongoose.model('TeacherPosition', teacherPositionSchema);
module.exports = TeacherPosition;
