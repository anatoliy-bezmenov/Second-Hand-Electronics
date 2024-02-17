const mongoose = require('mongoose');

const electronicsSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [10, 'Name should be at least 10 characters'],
        required: true,
    },
    type: {
        type: String,
        minLength: [2, 'Type should be at least 2 characters'],
        required: true,
    },
    production: {
        type: Number,
        min: [1900, 'Production year should be at least 1900'],
        max: [2023, 'Production year cannot exceed 2023'],
        required: true,
    },
    exploitation: {
        type: Number,
        min: [0, 'Years of exploitation should be at least 0'],
        required: [true, 'Year of exploitation field cannot be empty'],
    },
    damages: {
        type: String,
        minLength: [10, 'Damages should be at least 10 characters'],
        required: true,
    },
    image: {
        type: String,
        match: [/^https?:\/\//, 'Invalid image url'],
        required: true,
    },
    price: {
        type: Number,
        min: [0, 'Price should be at least 0'],
        required: true,
    },
    description: {
        type: String,
        minLength: [10, 'Description should be at least 10 characters'],
        maxLength: [200, 'Description cannot exceed 200 characters'],
        required: true,
    },
    buyingList: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    // createdAt: Date,
});

// electronicsSchema.pre('save', function() {
//     if (!this.createdAt) {
//         this.createdAt = Date.now();
//     };
// });

const Electronics = mongoose.model('Electronics', electronicsSchema);

module.exports = Electronics;