const express = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // check this confirmPassword field is required or not
    // confirmPassword: {
    //     type: String,
    //     required: true,
    // },
    accountType: {
        type: String,
        required: true,
        enum: ['Admin', 'Student', 'Instructor']
    },
    contactNumber: {
        type: Number,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    },
    Courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    resetPasswordExpires: {
        type: Date,
    },
    token: {
        type: String,
    },
    image: {
        type: String,
       // required: true
    },
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseProgress'
    }],
},
    { timestamps: true });

module.exports = mongoose.model('User', userSchema);
