const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
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
// user
router.get('/get-projects', projectController.getProjects);
//admin
router.get('/get', verifyToken, projectController.getProjects);
router.post('/add', verifyToken, upload.fields([{ name: "image", maxCount: 1 }, { name: "proof", maxCount: 1 }]), projectController.addCategory);
router.put("/update/:id", verifyToken, upload.fields([{ name: "mainImage" }, { name: "proof" }]), projectController.editProject);
router.delete('/delete/:id', verifyToken, projectController.deleteProject);



module.exports = router;


