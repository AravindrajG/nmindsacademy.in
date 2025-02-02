const express = require("express");
const router = express.Router();
const authController = require('../controllers/eventController')
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });
router.post('/add',  upload.single("image"), authController.addEvents)
router.get('/get', authController.getEvents);
router.get("/get/:id", authController.getEventDetails);
router.get('/random', authController.randomEvent);
router.delete('/delete/:id', authController.deleteEventById);
router.get('/recent', authController.recentEvents);
module.exports = router;
