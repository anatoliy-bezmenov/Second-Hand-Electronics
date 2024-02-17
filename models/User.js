const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        minLength: [10, 'Email should be at least 10 characters'],
        unique: true,
        match: [/@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/, 'Invalid Email Address'],
        // lowercase: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [3, 'Username should be at least 3 characters'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [4, 'Password should be at least 4 characters'],
    },
    createdElectronics: [{
        type: mongoose.Types.ObjectId,
        ref: 'Electronics',
    }],
    boughtElectronics: [{
        type: mongoose.Types.ObjectId,
        ref: 'Electronics',
    }],
    /////////////////
    // signedUpCourses: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Course',
    // }],
});

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

module.exports = User;