const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    identity: { type: String }, // Số CCCD
    dob: { type: Date }, // Ngày sinh
    avatar: { type: String }, // Đường dẫn ảnh đại diện
    isDeleted: { type: Boolean, default: false },
    role: { 
        type: String, 
        enum: ['STUDENT', 'TEACHER', 'ADMIN'], 
        required: true,
        default: 'TEACHER'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
