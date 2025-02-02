const express = require('express');
const galleryController = require('../controllers/galleryController'); // Assuming your controller is in the 'controllers' folder

const router = express.Router();

// Define a route to create a new gallery with image uploads
router.post('/create', galleryController.createGallery); // POST request to create a gallery
router.get('/get', galleryController.getGalleries);
router.delete('/delete/:id', galleryController.deleteGallery);

module.exports = router;
