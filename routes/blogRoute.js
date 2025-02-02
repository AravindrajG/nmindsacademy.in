const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogControllers');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
// app.use(express.json());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({  message: 'Authorization header is missing' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({  message: 'Malformed token' });
  }

  const token = tokenParts[1]; // Extract the actual token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Token is valid, proceed to the next middleware
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(403).json({  message: 'Invalid or expired token' });
  }
};


router.post('/submit', upload.fields([{ name: 'mainImage' }, { name: 'secondImage' }]), blogController.submitBlogs);
router.get('/blog/:id', blogController.getBlogById);
router.get('/getBlogs', blogController.getAllBlogs);
router.get('/latest', blogController.getLatestBlogs);
router.get('/random', blogController.getRandom);
router.delete('/blog/:id', blogController.deleteBlogById);
router.put('/blog/:id',upload.fields([{ name: 'mainImage' }, { name: 'secondImage' }]), blogController.editBlogById);

//add blog categories
//admin
router.get('/category', verifyToken, blogController.getBlogTypes);
router.post('/category',verifyToken, blogController.addCategory);
router.put('/update/:id', verifyToken, blogController.updateCategory);
router.delete('/delete/:id', verifyToken, blogController.deleteCategory);



module.exports = router;


