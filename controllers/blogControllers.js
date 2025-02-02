const Blog = require('../models/blog');
const BlogCategory = require('../models/blogCategory');
const fs = require('fs');
const path = require('path');

exports.submitBlogs = async (req, res) => {
  try {
    const {
      title, author, date, mainContent, subheading,
      quote, bullets, subheadingH4, additionalContent, blogCategory
    } = req.body;

    // Handle bullet points as an array
    const bulletArray = bullets ? bullets.split('\n').map((line) => line.trim()) : [];
    const mainImage = req.files.mainImage ? `/uploads/${req.files.mainImage[0].filename}` : null;
    const secondImage = req.files.secondImage ? `/uploads/${req.files.secondImage[0].filename}` : null;

    const blog = new Blog({
      title,
      author,
      date,
      mainImage,
      mainContent,
      subheading,
      quote,
      bullets: bulletArray,
      subheadingH4,
      secondImage,
      additionalContent,
      blogCategory
    });

    await blog.save();
    res.status(201).json({ message: 'Blog post created successfully', blog });
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.status(500).json({ message: 'An error occurred while creating the blog post' });
  }
}

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 }).populate('blogCategory');
    res.status(200).json(blogs); // Return blogs as JSON
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "An error occurred while fetching blogs." });
  }
};

exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate('blogCategory');
    const blogCategory = await BlogCategory.find();

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({blog, blogCategory});
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ message: "Error fetching blog details" });
  }
};


exports.getLatestBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 }).populate('blogCategory').limit(5);

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json(blogs); // Return the blogs data as JSON
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Error fetching latest blogs" });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const randomBlog = await Blog.aggregate([{ $sample: { size: 1 } }]);
    const blogCategory = await BlogCategory.find();

    if (!randomBlog || randomBlog.length === 0) {
      return res.status(404).json({ message: "No blogs found." });
    }
    res.status(200).json({blog: randomBlog[0], blogCategory});
  } catch (err) {
    console.error("Error fetching random event:", err);
    res.status(500).json({ message: "An error occurred while fetching a random event." });
  }
}

exports.deleteBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check and delete main image if it exists
    if (blog.mainImage) {
      const mainImagePath = path.join(__dirname, '..', blog.mainImage); // Adjust path according to your storage structure
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath); // Delete the image from the file system
        console.log('Main image deleted successfully');
      } else {
        console.log('Main image not found');
      }
    }

    // Check and delete second image if it exists
    if (blog.secondImage) {
      const secondImagePath = path.join(__dirname, '..', blog.secondImage); // Adjust path according to your storage structure
      if (fs.existsSync(secondImagePath)) {
        fs.unlinkSync(secondImagePath); // Delete the image from the file system
        console.log('Second image deleted successfully');
      } else {
        console.log('Second image not found');
      }
    }

    // Delete the blog post from the database
    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting Blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.editBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;


    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const updatedData = {
      title: req.body.title,
      author: req.body.author,
      date: req.body.date,
      subheading: req.body.subheading,
      quote: req.body.quote,
      bullets: req.body.bullets,
      subheadingH4: req.body.subheadingH4,
      additionalContent: req.body.additionalContent,
      mainContent: req.body.mainContent,
      blogCategory: req.body.blogCategory
    };

    if (files.mainImage) {
      const oldImagePath = path.join(__dirname, '..', existingBlog.mainImage);
      if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
      }
      updatedData.mainImage = files.mainImage[0].path;
  }

  if (files.secondImage) {
      const oldSecondImagePath = path.join(__dirname, '..', existingBlog.secondImage);
      if (fs.existsSync(oldSecondImagePath)) {
          fs.unlinkSync(oldSecondImagePath);
      }
      updatedData.secondImage = files.secondImage[0].path;
  }
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


exports.addCategory = async ( req, res) => {
  try{
       const { name, description } = req.body;

      if (!name) {
          return res.status(400).json({ message: 'Blog category name is required' });
      }

      const blogCategory = new BlogCategory({ name, description });
      await blogCategory.save();

      res.status(201).json({ message: 'Blog category added successfully', blogCategory });

  } catch(e) {
    console.log(e);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getBlogTypes = async (req, res) => {
    try {
        const blogCategory = await BlogCategory.find();
        res.status(200).json({ courseTypes: blogCategory });
    } catch (error) {
        console.error('Error fetching course types:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    console.log('Request body:', name);
    console.log('ID:', id);

    const courseType = await BlogCategory.findById(id);

    if (!courseType) {
      return res.status(404).json({ message: 'Course type not found' });
    }

    // Update only provided fields
    if (name !== undefined) courseType.name = name;
    if (description !== undefined) courseType.description = description;

    const updatedCourseType = await courseType.save();

    res.status(200).json({
      message: 'Course type updated successfully',
      courseType: updatedCourseType,
    });
  } catch (e) {
    console.error('Error updating category:', e.message, e.stack);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteCategory = async (req, res) => {
  try{
    const { id } = req.params;
    const blogCategory = await BlogCategory.findById(id);

    if (!blogCategory) {
        return res.status(404).json({ message: 'Category type not found' });
    }

    await blogCategory.deleteOne();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch(e) {
    console.error('Error fetching blog categories types:', error);
        res.status(500).json({ message: 'Server error' });
  }
}