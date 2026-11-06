const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'technician', 'medical_staff','maintenance_manager', 'department_manager']
        },
        phone: String,
        department: String,
        specialty: String,
        isActive: {
            type: Boolean,
            default: true
        }
    }
)
module.exports = mongoose.model('UserOnline', UserSchema)