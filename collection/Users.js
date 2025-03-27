const mongoose = require('mongoose');
const {connectDB} = require('../utils')
const bcrypt = require('bcrypt');

connectDB();

const UserSchema = new mongoose.Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false }
});

UserSchema.pre('save', async function(next) {  // Use async/await for cleaner code
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const hash = await bcrypt.hash(user.password, 10); // 10 is the salt rounds (adjust as needed)
        user.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.comparePassword = async function(password) { // Use async/await
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        return false; // Or handle the error as you see fit
    }
};

module.exports = mongoose.model('User', UserSchema);