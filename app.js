const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');

app.use(cors());

// Middleware or routes here
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', userRoutes);
app.use('/api/course', require('./routes/courseRoute'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/gallery', require('./routes/galleryRoute'));
app.use('/api/events', require('./routes/eventRoute'));
app.use('/api/blogs', require('./routes/blogRoute'));
app.use('/api/projects', require('./routes/projectRoute'));

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html'); // Adjust the path to your 404 page
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


module.exports = app; // Export the app
