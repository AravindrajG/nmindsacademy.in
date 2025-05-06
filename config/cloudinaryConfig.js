const cloudinary = require('cloudinary').v2;

// Configuration using your Cloudinary credentials
cloudinary.config({
  cloud_name: 'dbkiks5y4',  // Replace with your Cloudinary cloud name
  api_key: '472566923421752',        // Replace with your API key
  api_secret: 'TWBxYI77yHuCHJjxa1wN74Z2n5Y'   // Replace with your API secret
});

module.exports = cloudinary;
