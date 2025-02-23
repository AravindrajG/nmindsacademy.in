// const Blog = require('../models/blog');
const Project = require('../models/project');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinaryConfig');
const Cloudinary = require('cloudinary').v2;



function getPublicIdFromUrl(url) {
  const parts = url.split('/');
  const publicId = parts.slice(7).join('/').split('.')[0];
  return publicId;
}

exports.addCategory = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description || !req.files || !req.files.image || !req.files.proof) {
            return res.status(400).json({ message: "All fields are required!." });
        }

        // // const imageUrl = `${req.files.image[0].filename}`;
        // // const proofUrl = `${req.files.proof[0].filename}`;

        // const uploadedImage = await cloudinary.uploader.upload(req.files.image[0].path, {
        //     folder: "projects", // Optional: Organize files in a folder
        //   });

        //   // Upload proof to Cloudinary
        //   const uploadedProof = await cloudinary.uploader.upload(req.files.proof[0].path, {
        //     folder: "projects", // Optional: Organize files in a folder
        //     resource_type: "raw", // Use raw for files like PDFs
        //   });


              let mainImageUrl = null;
              let uploadedProof = null;
             if (req.files.image) {
                const mainImage = req.files.image[0];
                const mainImageUpload = await cloudinary.uploader.upload(mainImage.path, {
                  folder: "projects",
                });
                mainImageUrl = mainImageUpload.secure_url;
              }

              if (req.files.proof) {
                const secondImage = req.files.proof[0];
                const secondImageUpload = await cloudinary.uploader.upload(secondImage.path, {
                  folder: "projects",
                  resource_type: "raw",
                });
                uploadedProof = secondImageUpload.secure_url;
              }

        const project = new Project({ title, description, mainImage: mainImageUrl, proof: uploadedProof });
        await project.save();

        res.status(201).json({ data: project });

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getProjects = async (req, res) => {
    try {
        const Projects = await Project.find()
        res.status(201).json({ data: Projects });

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
}



exports.deleteProject = async (req, res) => {
  try {
      const id = req.params.id;

      // Validate ID
      if (!id) {
          return res.status(404).json({ message: "Project ID not provided" });
      }

      const project = await Project.findById(id);
      if (!project) {
          return res.status(404).json({ message: "Project not found" });
      }

      function getPublicId(url) {
          if (!url) return null;
          const regex = /\/upload\/(?:v\d+\/)?([^/.]+)(?:\.\w+)?$/;
          const match = url.match(regex);
          return match ? match[1] : null;
      }

      const mainImagePublicId = getPublicId(project.mainImage);
      const proofPublicId = getPublicId(project.proof);

      const deleteOperations = [mainImagePublicId, proofPublicId]
          .filter(Boolean)
          .map((publicId) => cloudinary.uploader.destroy(publicId, { resource_type: "image" }));

      await Promise.all(deleteOperations);

      function deleteLocalFile(filePath) {
          if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted local file: ${filePath}`);
          }
      }

      const mainImagePath = path.join(__dirname, "..", "uploads", project.mainImage);
      const proofPath = path.join(__dirname, "..", "uploads", project.proof);

      deleteLocalFile(mainImagePath);
      deleteLocalFile(proofPath);

      await project.deleteOne();

      res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


exports.editProject = async (req, res) => {
    try {
        const id = req.params.id;

        // Ensure the request contains a valid body
        if (!req.body.title || !req.body.description) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Fetch the existing project
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Construct the update object
        const updateData = {
            title: req.body.title || project.title,
            description: req.body.description || project.description,
        };

        const uploadDir = path.join(__dirname, "..", "uploads");
        console.log(req.files);

        // // Handle main image update
        // if (req.files["mainImage"]) {
        //     const newMainImage = req.files["mainImage"][0].filename;


        //     // Delete old image if exists
        //     if (project.mainImage) {
        //         const oldImagePath = path.join(uploadDir, project.mainImage);
        //         if (fs.existsSync(oldImagePath)) {
        //             fs.unlinkSync(oldImagePath);
        //             console.log(`Deleted old image: ${oldImagePath}`);
        //         }
        //     }

        //     updateData.mainImage = newMainImage;
        // }

        // // Handle proof image update
        // if (req.files["proof"]) {
        //     const newProof = req.files["proof"][0].filename;

        //     // Delete old proof if exists
        //     if (project.proof) {
        //         const oldProofPath = path.join(uploadDir, project.proof);
        //         if (fs.existsSync(oldProofPath)) {
        //             fs.unlinkSync(oldProofPath);
        //             console.log(`Deleted old proof: ${oldProofPath}`);
        //         }
        //     }

        //     updateData.proof = newProof;
        // }


        function getPublicId(url) {
          const regex = /upload\/(?:v\d+\/)?(.+)\.\w+$/;  // Regex to extract public ID
          const match = url.match(regex);
          return match ? match[1] : null;
      }

        if (req.files['mainImage']) {
            const newMainImage = req.files['mainImage'][0].path; // Full path to uploaded image

            // Delete old image from Cloudinary
            if (project.mainImage) {
              const oldImagePublicId = getPublicId(project.mainImage);
              if (oldImagePublicId) {
                await cloudinary.uploader.destroy(oldImagePublicId, (error, result) => {
                  if (error) {
                    console.error('Error deleting old image from Cloudinary:', error);
                  } else {
                    console.log('Old image deleted from Cloudinary:', result);
                  }
                });
              }
            }

            // Upload new image to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(newMainImage);
            updateData.mainImage = uploadedImage.secure_url; // Save Cloudinary URL to database
          }


          // Handle proof image update
          if (req.files['proof']) {
            const newProof = req.files['proof'][0]; // Full path to uploaded proof file

            // Delete old proof from Cloudinary
            if (project.proof) {

              const oldProofPublicId = getPublicId(project.proof);
              console.log(oldProofPublicId,'oldproofid');

              if (oldProofPublicId) {
                await cloudinary.uploader.destroy(oldProofPublicId, { resource_type: 'raw' }, (error, result) => {
                  if (error) {
                    console.error('Error deleting old proof from Cloudinary:', error);
                  } else {
                    console.log('Old proof deleted from Cloudinary:', result);
                  }
                });
              }
            }

            // Upload new proof to Cloudinary
            const uploadedProof = await cloudinary.uploader.upload(newProof, { resource_type: 'raw' });
            updateData.proof = uploadedProof.secure_url; // Save Cloudinary URL to database
          }


        // Update project in database
        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ success: true, message: "Project updated successfully", project: updatedProject });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};