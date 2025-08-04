const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const degreeSchema = new Schema({
    type: { type: String, required: true }, // Bậc: Bác sĩ, Thạc sĩ, Cử nhân...
    school: { type: String, required: true }, // Trường
    major: { type: String, required: true }, // Chuyên ngành
    year: { type: Number }, // Năm tốt nghiệp
    isGraduated: { type: Boolean, default: true } // Trạng thái tốt nghiệp
});

const teacherSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teacherPositionsId: [{ type: Schema.Types.ObjectId, ref: 'TeacherPosition' }],
    isActive: { type: Boolean, default: true }, // Trạng thái công tác
    isDeleted: { type: Boolean, default: false },
    code: { type: String, unique: true }, // Mã giáo viên
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    degrees: [degreeSchema]
}, { timestamps: true });

// Pre-save middleware để tự động tạo mã giáo viên
teacherSchema.pre('save', async function(next) {
    if (!this.code) {
        // Tạo mã giáo viên tự động (GV + năm + số thứ tự)
        const year = new Date().getFullYear();
        const count = await this.constructor.countDocuments();
        this.code = `GV${year}${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
