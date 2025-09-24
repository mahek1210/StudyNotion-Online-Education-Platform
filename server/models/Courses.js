const mongoose = require('mongoose');
const Category = require('./Category');

const CourseSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    courseDescription: {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReview',
    }],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    Tags: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Tag"
        type: [String],
    },
    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: []
    }],
    instructions: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
//     sections: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Section"
//   }
});

module.exports = mongoose.model('Courses', CourseSchema);