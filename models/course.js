const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    rating: {
      average: { type: Number, default: 0 },
      totalRatedPersons: { type: Number, default: 0 },
      ratingCount: { type: Map, of: Number, default: {} },
  },
    instructor: String,
    pdf: String,
    image: String,
    price:Number,
    studentsCount:Number,
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseType', required: true },
    duration:String,
    sections: [
        {
          sectionTitle: { type: String, required: true },
          lessons: [
            {
              title: { type: String, required: true },
              duration: { type: String, required: true },
            },
          ],
        },
      ],
});

module.exports  = mongoose.model('Course', courseSchema);