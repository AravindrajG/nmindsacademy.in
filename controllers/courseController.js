const Course = require('../models/course');
const fs = require('fs');
const path = require('path');
const CourseType = require('../models/courseType');
const cloudinary = require('../config/cloudinaryConfig');


exports.addCourse = async (req, res) => {
    try {
        const { title, description, instructor, price, studentsCount, type, duration, sections } = req.body;

        let imageUrl = null;
        let pdfUrl = null;

        // Upload image file to Cloudinary
        if (req.files['image'] && req.files['image'][0]) {
            const imageUpload = await cloudinary.uploader.upload(req.files['image'][0].path, {
                folder: 'courses/images', // Folder to organize course images
            });
            imageUrl = imageUpload.secure_url; // Secure URL of the uploaded image
        }

        // Upload PDF file to Cloudinary
        if (req.files['pdf'] && req.files['pdf'][0]) {
            const pdfUpload = await cloudinary.uploader.upload(req.files['pdf'][0].path, {
                folder: 'courses/pdfs', // Folder to organize course PDFs
                resource_type: 'raw', // Specify the resource type for non-image files
            });
            pdfUrl = pdfUpload.secure_url; // Secure URL of the uploaded PDF
        }

        // Create a new course document
        const newCourse = new Course({
            title,
            description,
            instructor,
            image: imageUrl, // Save Cloudinary image URL
            pdf: pdfUrl, // Save Cloudinary PDF URL
            price,
            studentsCount,
            type,
            duration,
            sections: JSON.parse(sections) || [],
        });

        // Save the course to the database
        await newCourse.save();
        res.status(201).send({ message: 'Course added successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error saving course', error });
    }
}

exports.allCourse = async (req, res) => {
    try {
        const courses = await Course.find().populate('type', 'name description');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching courses', error });
    }
}



exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve the current course to check existing files
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        // Check if image or PDF files are sent in the request
        const imageFile = req.files?.image ? req.files.image[0].filename : undefined;
        const pdfFile = req.files?.pdf ? req.files.pdf[0].filename : undefined;

        const updatedFields = {
            title: req.body.title,
            description: req.body.description,
            instructor: req.body.instructor,
            price: req.body.price,
            studentsCount: req.body.studentsCount,
            duration: req.body.duration,
            sections: JSON.parse(req.body.sections),
        };

        // // If there's a new image, delete the old image if it exists
        // if (imageFile) {
        //   const oldImagePath = path.join(__dirname, '../uploads', course.image); // Path to old image
        //   if (fs.existsSync(oldImagePath)) {
        //     // fs.unlinkSync(oldImagePath);
        //   }
        //   updatedFields.image = imageFile;
        // }

        // // If there's a new PDF, delete the old PDF if it exists
        // if (pdfFile) {
        //   const oldPdfPath = path.join(__dirname, '../uploads', course.pdf); // Path to old PDF
        //   if (fs.existsSync(oldPdfPath)) {
        //     fs.unlinkSync(oldPdfPath); // Delete the old PDF
        //   }
        //   updatedFields.pdf = pdfFile; // Set the new PDF filename
        // }

        const getPublicIdFromUrl = (url) => {
            const parts = url.split('/');
            const publicIdWithExtension = parts.slice(7).join('/'); // Start from folder path
            return publicIdWithExtension.split('.')[0]; // Remove file extension
          };

        // Delete old image from Cloudinary and upload the new one if provided
        if (req.files?.image && req.files.image[0]) {
            const oldImagePublicId = course.image ? getPublicIdFromUrl(course.image) : null;

            if (oldImagePublicId) {
                await cloudinary.uploader.destroy(oldImagePublicId);
            }

            const imageUpload = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: 'courses/images',
            });
            updatedFields.image = imageUpload.secure_url; // Save the new image URL
        }

        // Delete old PDF from Cloudinary and upload the new one if provided
        if (req.files?.pdf && req.files.pdf[0]) {
            const oldPdfPublicId = course.pdf ? getPublicIdFromUrl(course.pdf) : null;

            if (oldPdfPublicId) {
                await cloudinary.uploader.destroy(oldPdfPublicId, { resource_type: 'raw' });
            }

            const pdfUpload = await cloudinary.uploader.upload(req.files.pdf[0].path, {
                folder: 'courses/pdfs',
                resource_type: 'raw', // Specify for non-image files
            });
            updatedFields.pdf = pdfUpload.secure_url; // Save the new PDF URL
        }

        if (req.body.type) {
            updatedFields.type = req.body.type;
        }

        // Update the course with the new details and files
        const updatedCourse = await Course.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedCourse) {
            return res.status(404).send({ message: 'Course not found' });
        }

        res.status(200).send({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send({ message: 'Server error' });
    }
};


exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params; // Get course ID from URL params

        // Find the course by ID
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        // if (course.image) {
        //     const imagePath = path.join(__dirname, '..', 'uploads', course.image);
        //     fs.unlinkSync(imagePath);
        // }

        // if (course.pdf) {
        //     const pdfPath = path.join(__dirname, '..', 'uploads', course.pdf);
        //     fs.unlinkSync(pdfPath);
        // }

         // Delete the course image from Cloudinary

        const getPublicIdFromUrl = (url) => {
            const parts = url.split('/');
            const publicIdWithExtension = parts.slice(7).join('/'); // Start from folder path
            return publicIdWithExtension.split('.')[0]; // Remove file extension
          };

    if (course.image) {
        const imagePublicId = getPublicIdFromUrl(course.image);
        if (imagePublicId) {
          await cloudinary.uploader.destroy(imagePublicId, (error, result) => {
            if (error) {
              console.error('Error deleting image from Cloudinary:', error);
            } else {
              console.log('Image deleted from Cloudinary:', result);
            }
          });
        }
      }

      // Delete the course PDF from Cloudinary
      if (course.pdf) {
        const pdfPublicId = getPublicIdFromUrl(course.pdf);
        if (pdfPublicId) {
          await cloudinary.uploader.destroy(pdfPublicId, { resource_type: 'raw' }, (error, result) => {
            if (error) {
              console.error('Error deleting PDF from Cloudinary:', error);
            } else {
              console.log('PDF deleted from Cloudinary:', result);
            }
          });
        }
      }


        await Course.findByIdAndDelete(id);

        res.status(200).send({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({ message: 'Error deleting course', error });
    }
};


exports.getCoursesByType = async (req, res) => {
    try {
        const { typeIds } = req.body;

        const query = typeIds && typeIds.length > 0
            ? { type: { $in: typeIds } }
            : {};

        // Fetch courses based on the query
        const courses = await Course.find(query).populate('type');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching filtered courses', error });
    }
};


//course type
exports.addCourseType = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Course type name is required' });
        }

        const newCourseType = new CourseType({ name, description });
        await newCourseType.save();

        res.status(201).json({ message: 'Course type added successfully', courseType: newCourseType });
    } catch (error) {
        console.error('Error adding course type:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCourseTypes = async (req, res) => {
    try {
        const courseTypes = await CourseType.find();
        res.status(200).json({ courseTypes });
    } catch (error) {
        console.error('Error fetching course types:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCourseType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const courseType = await CourseType.findById(id);

        if (!courseType) {
            return res.status(404).json({ message: 'Course type not found' });
        }

        if (name) courseType.name = name;
        if (description) courseType.description = description;

        const updatedCourseType = await courseType.save();

        res.status(200).json({
            message: 'Course type updated successfully',
            courseType: updatedCourseType
        });
    } catch (error) {
        console.error('Error updating course type:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteCourseType = async (req, res) => {
    try {
        const { id } = req.params;
        const courseType = await CourseType.findById(id);

        if (!courseType) {
            return res.status(404).json({ message: 'Course type not found' });
        }

        await courseType.deleteOne();
        res.status(200).json({ message: 'Course type deleted successfully' });
    } catch (error) {
        console.error('Error deleting course type:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id).populate('type');

        if (!course) {
            return res.status(404).json({ message: 'Course type not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        console.error("Error fetching course details:", err);
        res.status(500).json({ message: "An error occurred while fetching course details." });
    }
}

exports.getRandomCourse = async (req, res) => {
    try {
        const randomCourse = await Course.find().populate('type').limit(1);

        if (!randomCourse || randomCourse.length === 0) {
            return res.status(404).json({ message: "No Courses found." });
        }
        res.status(200).json(randomCourse[0]);
    } catch (err) {
        console.error("Error fetching random event:", err);
        res.status(500).json({ message: "An error occurred while fetching a random event." });
    }
}

exports.rating = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    try {
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const currentCount = course.rating.ratingCount.get(String(rating)) || 0;
        course.rating.ratingCount.set(String(rating), currentCount + 1);
        course.rating.totalRatedPersons += 1;
        const totalRating = Array.from(course.rating.ratingCount.entries()).reduce(
            (acc, [star, count]) => acc + star * count,
            0
        );
        course.rating.average = totalRating / course.rating.totalRatedPersons;


        await course.save();

        res.json({ message: 'Rating submitted successfully', rating: course.rating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


