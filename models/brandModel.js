const mongoose = require('mongoose')


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand required'],
        unique: [true, 'Brand must be unique'],
        minLength: [3, 'Too short brand name'],
        maxLength: [32, 'Too long brand name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: {
        type: String
    }
}, { timestamps: true })

const brandModel = mongoose.model('brand', brandSchema);

module.exports = brandModel;