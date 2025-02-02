const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true },
    mainImage: { type: String, required: true },
    mainContent: { type: String, required: true },
    subheading: String,
    quote: String,
    bullets: [String],
    subheadingH4: String,
    secondImage: String,
    additionalContent: String,
    blogCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory', required: true },

});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
