// const Blog = require('../models/blog');
const Project = require('../models/project');
const fs = require('fs');
const path = require('path');


exports.addCategory = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description || !req.files || !req.files.image || !req.files.proof) {
            return res.status(400).json({ message: "All fields are required!." });
        }

        const imageUrl = `${req.files.image[0].filename}`;
        const proofUrl = `${req.files.proof[0].filename}`;

        const project = new Project({ title, description, mainImage: imageUrl, proof: proofUrl });
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

        // Simulated project retrieval from DB (Replace with actual DB call)
        if (!id) {
            return res.status(404).json({ message: "ProjectId not found" });
        }

        const projects = await Project.findById(id);

        if (!projects) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Remove images from the server
        const mainImagePath = path.join(__dirname, '..', "uploads", projects.mainImage);
        const proofPath = path.join(__dirname, "..", "uploads", projects.proof);
        console.log(mainImagePath);

        [mainImagePath, proofPath].forEach((file) => {
            if (file) {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            }
        });

        await projects.deleteOne();
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
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

        // Handle main image update
        if (req.files["mainImage"]) {
            const newMainImage = req.files["mainImage"][0].filename;
            console.log(newMainImage,'lkcslsk--->????');


            // Delete old image if exists
            if (project.mainImage) {
                const oldImagePath = path.join(uploadDir, project.mainImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log(`Deleted old image: ${oldImagePath}`);
                }
            }

            updateData.mainImage = newMainImage;
        }

        // Handle proof image update
        if (req.files["proof"]) {
            const newProof = req.files["proof"][0].filename;

            // Delete old proof if exists
            if (project.proof) {
                const oldProofPath = path.join(uploadDir, project.proof);
                if (fs.existsSync(oldProofPath)) {
                    fs.unlinkSync(oldProofPath);
                    console.log(`Deleted old proof: ${oldProofPath}`);
                }
            }

            updateData.proof = newProof;
        }

        // Update project in database
        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ success: true, message: "Project updated successfully", project: updatedProject });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};