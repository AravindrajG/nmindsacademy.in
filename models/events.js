const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    location: String,
    fromDate: Date,
    toDate:Date,
    startTime:String,
    endTime:String,
    studentsCount:Number,
    ticketPrice:Number,
    map:String,
    learningOutcomes: [String],
});

module.exports  = mongoose.model('Event', eventSchema);