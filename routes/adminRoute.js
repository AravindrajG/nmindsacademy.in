const express = require('express');
const router = express.Router();
const authController = require('../controllers/adminControllers');
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ redirect: '/signin.html', message: 'Authorization header is missing' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ redirect: '/signin.html', message: 'Malformed token' });
  }

  const token = tokenParts[1]; // Extract the actual token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Token is valid, proceed to the next middleware
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(403).json({ redirect: '/signin.html', message: 'Invalid or expired token' });
  }
};



router.get('/get',verifyToken, authController.getAdmins);
router.post('/login', authController.adminLogin);
router.delete('/delete/:id',verifyToken, authController.deleteAdmin);
router.get('/dashBoard', verifyToken, authController.dashBoard);
router.get('/students', verifyToken, authController.getStudents)


module.exports = router;