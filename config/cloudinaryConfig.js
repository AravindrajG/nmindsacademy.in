const cloudinary = require('cloudinary').v2;

// Configuration using your Cloudinary credentials
cloudinary.config({
  cloud_name: 'dblw2fpoh',  // Replace with your Cloudinary cloud name
  api_key: '451272537281443',        // Replace with your API key
  api_secret: '6TDUbGzF4GdW7PglwQ25_C5OMsE'   // Replace with your API secret
});

module.exports = cloudinary;
