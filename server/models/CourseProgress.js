const mongoose = require('mongoose');

const CourseProgressSchema = new mongoose.Schema({
    CourseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    CompletedVieos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
    }
],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});

module.exports = mongoose.model('CourseProgress', CourseProgressSchema);