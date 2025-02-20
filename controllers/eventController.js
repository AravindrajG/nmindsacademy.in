
const Event = require("../models/events");
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinaryConfig');


exports.addEvents =  async (req, res) => {
  try {
    const { title, description, learningOutcomes, location, fromDate, toDate, startTime, endTime, studentsCount, ticketPrice, map } = req.body;
    // const imageUrl = req.file.filename;
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: 'events', // Specify folder in Cloudinary
    });

    const newEvent = new Event({
        title,
        description,
        learningOutcomes,
        image: uploadedImage.secure_url,
        location,
        fromDate,
        toDate,
        startTime,
        endTime,
        studentsCount,
        ticketPrice,
        map,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully!" });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create event" });
}
}

exports.getEvents = async (req, res) => {
    try {
      const events = await Event.find(); // Fetch all events from the database
      res.status(200).json(events);
    } catch (err) {
      console.error("Error fetching events:", err);
      res.status(500).json({ message: "An error occurred while fetching events." });
    }
  }



exports.getEventDetails = async (req, res) => {
  const { id } = req.params; // Extract the event ID from the route parameter

  try {
    const event = await Event.findById(id); // Fetch the event by its ID
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json(event); // Return the event details
  } catch (err) {
    console.error("Error fetching event details:", err);
    res.status(500).json({ message: "An error occurred while fetching event details." });
  }
}

exports.randomEvent = async (req, res) => {
  try {
    const randomEvent = await Event.aggregate([{ $sample: { size: 1 } }]);
    if (!randomEvent || randomEvent.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }
    res.status(200).json(randomEvent[0]);
  } catch (err) {
    console.error("Error fetching random event:", err);
    res.status(500).json({ message: "An error occurred while fetching a random event." });
  }
}

exports.deleteEventById = async (req, res) => {
  try {
      const { id } = req.params;
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // if (event.image) {
      //   const imagePath = path.join(__dirname, '../uploads', event.image);
      //   if (fs.existsSync(imagePath)) {
      //     fs.unlinkSync(imagePath);
      //     console.log('Event image deleted successfully');
      //   } else {
      //     console.log('Event image not found');
      //   }
      // }
      if (event.image) {
        const getPublicIdFromUrl = (url) => {
          const parts = url.split('/');
          const publicIdWithExtension = parts.slice(7).join('/'); // Start from folder path
          return publicIdWithExtension.split('.')[0]; // Remove file extension
        };

        const publicId = getPublicIdFromUrl(event.image);

        await cloudinary.uploader.destroy(publicId, (err, result) => {
          if (err) {
            console.error('Error deleting image from Cloudinary:', err);
          } else {
            console.log('Image deleted successfully from Cloudinary:', result);
          }
        });
      }
      
      await event.deleteOne();
      res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
      console.error('Error deleting Event:', error);
      res.status(500).json({ message: 'Server error' });
  }
}

exports.recentEvents = async (req, res) => {
  try {
    const recentEvents = await Event.find()
      .sort({ toDate: -1 })
      .limit(5);
    res.status(200).json(recentEvents);
  } catch (error) {
    console.error('Error fetching recent events:', error);
  }
}


