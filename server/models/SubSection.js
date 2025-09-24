const mongoose = require('mongoose');

const SubSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
    },
    videoURL: {
        type: String,
    },
});


module.exports = mongoose.models.SubSection || mongoose.model('SubSection', SubSectionSchema);
