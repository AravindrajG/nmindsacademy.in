const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
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

const PORT_HTTP = 80;  // HTTP port
const PORT_HTTPS = 443;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/course', require('./routes/courseRoute'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/gallery', require('./routes/galleryRoute'));
app.use('/api/events', require('./routes/eventRoute'));
app.use('/api/blogs', require('./routes/blogRoute'));
app.use('/api/projects', require('./routes/projectRoute'));

// 404 Page
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); // Adjust the path to your 404 page
});

// Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Redirect HTTP to HTTPS (only in production)
if (process.env.NODE_ENV === 'production') {
  const http = require('http');
  http.createServer((req, res) => {
    res.writeHead(301, { Location: 'https://' + req.headers.host + req.url });
    res.end();
}).listen(PORT_HTTP, () => {
    console.log(`HTTP server running on port ${PORT_HTTP}, redirecting to HTTPS`);
});
}

module.exports = app;
