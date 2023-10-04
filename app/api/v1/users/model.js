const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const bcrypt = require('bcryptjs'); // library untuk melakukan hash password

let UserSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama pengguna harus diisi'],
            minLength: 3,
            maxLength: 50,
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email harus diisi'],
        },
        password: {
            type: String,
            required: [true, 'Password harus diisi'],
            minLength: 6,
        },
        role: {
            type: String,
            enum: ['admin', 'organizer', 'owner'],
            default: 'admin',
        },
        organizer: {
            type: mongoose.Types.ObjectId,
            ref: 'Organizer',
            required: true,
        }
    },
    { timestamps: true }
);


UserSchema.pre('save', async function (next) {
    const User = this;
    if (User.isModified('password')) {
        User.password = await bcrypt.hash(User.password, 12);
    }
    next();
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};


module.exports = mongoose.model('User', UserSchema);