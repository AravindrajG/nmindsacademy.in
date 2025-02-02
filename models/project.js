const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    mainImage: { type: String, required: true },
    proof:{type: String, required: true}, // image or pdf
    description: { type: String, required: true },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
