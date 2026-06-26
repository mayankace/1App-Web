const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide service name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide service description']
    },
    price: {
        type: Number,
        required: [true, 'Please provide service price']
    },
    duration: {
        type: Number,
        required: [true, 'Please provide estimated duration (in minutes)']
    },
    category: {
        type: String,
        required: [true, 'Please provide service category'],
        trim: true
    },
    subcategory: {
        type: String,
        required: [true, 'Please provide service subcategory'],
        trim: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

serviceSchema.index({ name: 1, category: 1, subcategory: 1 });

module.exports = mongoose.model('Service', serviceSchema);
