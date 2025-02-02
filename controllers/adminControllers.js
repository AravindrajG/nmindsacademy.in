const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Course = require('../models/course');

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error while fetching admins' });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await User.deleteOne({ _id: id });

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Server error while deleting admin' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const admin = await User.findOne({ email: userName });

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const userData = {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({ message: 'Sign in successful', token, user: userData });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" })

  }
}

exports.dashBoard = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalAdmins = await User.countDocuments({role: 'admin'});
    const totalStudents = await User.countDocuments({role: 'user'});

    // Send the response as JSON
    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalAdmins,
        totalStudents,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching stats',
    });
  }
}

exports.getStudents = async (req, res ) => {
  try{
    const users = await User.find({role: 'user'});
    res.status(200).json({success: true, data:users})
  } catch(e){
    console.log('Error fethching users',e)
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching users',
    });
  }
}