const mongoose = require('mongoose');

const courseTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CourseType', courseTypeSchema);

