const express = require('express');
const router = express.Router();
const authController = require('../controllers/courseController');
const multer = require('multer');
const jwt = require('jsonwebtoken');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
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

router.post('/add-course',  upload.fields([{ name: 'pdf' }, { name: 'image' }]), authController.addCourse);
router.get('/all-courses', authController.allCourse);
router.put('/all-courses/:id',  upload.fields([{ name: 'pdf' }, { name: 'image' }]), authController.updateCourse);
router.delete('/all-courses/:id', authController.deleteCourse);
router.get('/get/:id', authController.getCourse);
router.get('/random', authController.getRandomCourse);
router.post('/filter', authController.getCoursesByType);
router.get('/all-type', authController.getCourseTypes);
router.post('/all-type', authController.addCourseType);
router.put('/all-type/:id', authController.updateCourseType)
router.delete('/all-type/:id', authController.deleteCourseType);
router.post('/rate/:id', verifyToken, authController.rating);


module.exports = router;