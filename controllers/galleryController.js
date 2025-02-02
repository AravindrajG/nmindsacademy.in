const multer = require('multer');
const path = require('path');
const Gallery = require('../models/gallery');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

const uploadImages = upload.array('images', 10);

exports.createGallery = (req, res) => {
  uploadImages(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading images', error: err.message });
    }

    try {
      const { title, description } = req.body;
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

      const newGallery = new Gallery({
        title,
        description,
        images: imageUrls.map(url => ({ url, altText: title })),
      });

      await newGallery.save();
      res.status(201).json({ message: 'Gallery created successfully!', gallery: newGallery });
    } catch (error) {
      console.error('Error creating gallery:', error);
      res.status(500).json({ message: 'Error creating gallery', error });
    }
  });
};

exports.getGalleries = async (req, res) => {
    try {
      const galleries = await Gallery.find(); // Get all galleries from the database
      res.status(200).json({ galleries });
    } catch (error) {
      console.error('Error fetching galleries:', error);
      res.status(500).json({ message: 'Error fetching galleries', error });
    }
  };


exports.deleteGallery = async (req, res) => {
  const { id } = req.params;

  try {
    const carousel = await Gallery.findById(id);
    if (!carousel) {
      return res.status(404).json({ message: 'Carousel not found' });
    }

    // Sequentially delete images before deleting the carousel
    for (let i = 0; i < carousel.images.length; i++) {
      const image = carousel.images[i];
      const imagePath = path.join(__dirname, '..', image.url); // Adjust path as needed

      try {
        await fs.promises.unlink(imagePath);
        console.log(`Image ${image.url} deleted successfully`);
      } catch (err) {
        console.error(`Error deleting image ${image.url}:`, err);
      }
    }

    // After deleting all images, delete the carousel from the database
    await Gallery.deleteOne({ _id: id });
    res.status(200).json({ message: 'Carousel and images deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel:', error);
    res.status(500).json({ message: 'Server error while deleting carousel' });
  }
};
