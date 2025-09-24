const SubSection = require('../models/SubSection.js');
const Section = require('../models/Section.js');
const imageUploader = require('../utils/imageUpaloder.js');
const { getVideoDurationInSeconds } = require('get-video-duration');
const getVideoDuration = require("get-video-duration");
const { convertSecondsToDuration } = require("../utils/secToDuration.js");
const Course = require('../models/Courses.js');


// exports.createSubSection = async (req, res) => {
//   try {
//     console.log("createSubSection called");
//     console.log("req.body:", req.body);
//     console.log("req.files:", req.files);
//     const { title, sectionId, description } = req.body;

//     const video = req.files.video;

//     const { getVideoDurationInSeconds } = require('get-video-duration');

//     const durationInSeconds = await getVideoDurationInSeconds(req.files.video.tempFilePath);
//     const minutes = Math.floor(durationInSeconds / 60);
//     const seconds = Math.floor(durationInSeconds % 60);
//     const timeDuration = `${minutes}:${seconds}`;


//     if (!title || !sectionId || !video || !description) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'All fields are required' 
//     });
// }
//     console.log("all good");
//     // console.log("type of imageUploader", typeof imageUploader);

//     const uploadVideo = await imageUploader(video, process.env.FOLDER_NAME);
//     // const uploadVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

//     console.log("all good 1");

//     const SubSectionDetails = await SubSection.create({
//       title,
//       timeDuration,
//       // videoFile: uploadVideo.secure_url,
//       videoURL: uploadVideo.secure_url, // ✅ correct
//       description
//     });

//     const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId }, {
//       $push: { SubSection: SubSectionDetails._id },
//     }, { new: true }).populate('SubSection');

//     return res.status(201).json({
//       success: true,
//       message: 'SubSection created successfully',
//       data: updatedSection,
//     });
//   } catch (error) {
//     res.status(500).json({ 
//         success: false,
//         message: error.message });
//   }
// };


//update SubSection


exports.createSubSection = async (req, res) => {
  try {
    console.log("createSubSection called");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { title, sectionId, description } = req.body;
    const video = req.files?.video;   // ✅ consistent key

    if (!title || !sectionId || !video || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ get video duration and format it using your util
    const durationInSeconds = await getVideoDurationInSeconds(video.tempFilePath);
    const timeDuration = convertSecondsToDuration(durationInSeconds);

    // ✅ upload video to Cloudinary (ensure resource_type: "video" in your uploader)
    const uploadVideo = await imageUploader(video, process.env.FOLDER_NAME, "video");

    // ✅ create subsection
    const SubSectionDetails = await SubSection.create({
      title,
      timeDuration,
      videoURL: uploadVideo.secure_url,
      description,
    });

    // ✅ update section with new subsection
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { SubSection: SubSectionDetails._id } },
      { new: true }
    ).populate("SubSection");

   
    const updatedCourse = await Course.findOne({ courseContent: sectionId })
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection", // Capital 'S' to match your model
        },
      })
      .exec();

       return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      // data: updatedSection,
      data : updatedCourse,
    });



  } catch (error) {
    console.error("Error creating subsection:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.updateSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description } = req.body;
    const { id } = req.params;
    // const id = req.body.id;
    console.log("SubSection ID from req.params:", id);


    const subSection = await SubSection.findById(id);


    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: 'SubSection not found',
      });
    }

    const updateSubSection = await SubSection.findByIdAndUpdate(id, {
      title,
      timeDuration,
      description,
    }, { new: true });

    return res.status(200).json({
      success: true,
      message: 'SubSection updated successfully',
      data: updateSubSection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete SubSection

exports.deleteSubSection = async (req, res) => {
  try {
    // const { id } = req.params;
    const { subSectionId, sectionId } = req.body;

    const id = subSectionId;
    console.log("SubSection ID from req.body:", id);
    
    const subSection = await SubSection.findById(id);

  
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: 'SubSection not found',
      });
    }

    await SubSection.findByIdAndDelete(id);

     await Section.findByIdAndUpdate(sectionId, {
    $pull: { SubSection: id },
    });
    

    return res.status(200).json({
      success: true,
      message: 'SubSection deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// exports.deleteSubSection = async (req, res) => {
//   try {
//     const { subSectionId, sectionId } = req.body;

//     // 1. Check if the SubSection exists
//     const subSection = await SubSection.findById(subSectionId);
//     if (!subSection) {
//       return res.status(404).json({
//         success: false,
//         message: 'SubSection not found',
//       });
//     }

//     // 2. Delete the SubSection document
//     await SubSection.findByIdAndDelete(subSectionId);

//     // ✅ 3. Remove SubSection reference from the Section document
//     await Section.findByIdAndUpdate(sectionId, {
//       $pull: { SubSection: subSectionId },
//     });

//     return res.status(200).json({
//       success: true,
//       message: 'SubSection deleted and removed from Section successfully',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// const SubSection = require('../models/SubSection');
// const Section = require('../models/Section');
// const Course = require('../models/Courses'); // Add this import
// const imageUploader = require('../utils/imageUpaloder');
// const { getVideoDurationInSeconds } = require('get-video-duration');
// const { convertSecondsToDuration } = require("../utils/secToDuration");



// exports.updateSubSection = async (req, res) => {
//   try {
//     const { title, timeDuration, description, subSectionId, sectionId } = req.body;
//     console.log("SubSection ID:", subSectionId);

//     const subSection = await SubSection.findById(subSectionId);

//     if (!subSection) {
//       return res.status(404).json({
//         success: false,
//         message: 'SubSection not found',
//       });
//     }

//     // Update fields that are provided
//     const updateData = {};
//     if (title) updateData.title = title;
//     if (timeDuration) updateData.timeDuration = timeDuration;
//     if (description) updateData.description = description;

//     await SubSection.findByIdAndUpdate(subSectionId, updateData, { new: true });

//     // ✅ Return updated course
//     const updatedCourse = await Course.findOne({ courseContent: sectionId })
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec();

//     return res.status(200).json({
//       success: true,
//       message: 'SubSection updated successfully',
//       data: updatedCourse,
//     });
//   } catch (error) {
//     console.error("Update SubSection error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.deleteSubSection = async (req, res) => {
//   try {
//     const { subSectionId, sectionId } = req.body;
    
//     const subSection = await SubSection.findById(subSectionId);

//     if (!subSection) {
//       return res.status(404).json({
//         success: false,
//         message: 'SubSection not found',
//       });
//     }

//     // Delete the SubSection
//     await SubSection.findByIdAndDelete(subSectionId);

//     // ✅ FIXED: Use capital 'SubSection' to match your model
//     const updatedSection = await Section.findByIdAndUpdate(
//       sectionId,
//       { $pull: { SubSection: subSectionId } }, // Capital 'S' to match your model
//       { new: true }
//     ).populate("SubSection"); // Capital 'S' in populate

//     return res.status(200).json({
//       success: true,
//       message: 'SubSection deleted successfully',
//       data: updatedSection,
//     });
//   } catch (error) {
//     console.error("Delete SubSection error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };