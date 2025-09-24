// const mongoose = require("mongoose");

// const Section = require('../models/Section');
// const Course = require('../models/Courses');
// const User = require('../models/User');

// exports.createSection = async (req, res) => {
//     try {
//         const { sectionName, courseId } = req.body;

//         if (!sectionName || !courseId) {
//             return res.status(400).json({
//             success: false,
//             message: 'All fields are required'
//             });
//         }

//         const newSection = await Section.create({ sectionName});

//         const updatedCourse = await Course.findByIdAndUpdate(courseId, {
//             $push: {
//                 sections: newSection._id
//             }
//         },
//     {new: true}).populate('sections');


//         // const updatedCourse = await Course.findByIdAndUpdate(
//         //     courseId,
//         //     { $push: { sections: newSection._id } },
//         //     { new: true }
//         // )
//         //     .populate({
//         //         path: 'sections',
//         //         populate: { path: 'subSections' }
//         //     })
//         //     .exec();


//         // res.status(201).json({
//         //     success: true,
//         //     message: 'Section created successfully',
//         //     data: newSection
//         // });


//         res.status(201).json({
//             success: true,
//             message: 'Section created successfully',
//             data   : updatedCourse   // ✅ send the updated course instead of just the new section
//         });



//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             mmessage: error.message,
//             message: 'Server error. Please try again.'
//         });
//     }
// };


// exports.updateSection = async (req, res) => {
//     try {
//         const { sectionName,sectionId } = req.body;
//         // const sectionId = req.params.id;
//         console.log(sectionId);
//         console.log(sectionName);
//         if (!sectionName || !sectionId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required'
//             });
//         }

//         const updatedSection = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

//         res.status(200).json({
//             success: true,
//             message: 'Section updated successfully',
//             data: updatedSection
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error. Please try again.'
//         });
//     }
// }


// // exports.deleteSection = async (req, res) => {
// //     try {
// //         console.log("delete section called");
// //         // const sectionId = req.params.id;
// //         const sectionId = req.body.sectionId;
// //         console.log(sectionId);

// //         await Section.findByIdAndDelete(sectionId);

// //                 Section.updateMany({}, { $pull: { sections: sectionId } });


// // // const deletedSection = await Section.findByIdAndDelete(sectionId);
// // //         res.status(200).json({
// // //             success: true,
// // //             message: 'Section deleted successfully'
// // //         });
// //     } catch (error) {
// //         console.log(error);
// //         res.status(500).json({
// //             success: false,
// //             message: 'Server error. Please try again.'
// //         });
// //     }
// // }

// not change to look
// exports.deleteSection = async (req, res) => {
//     try {
//         // console.log("Deleting Section...");
//         const { sectionId } = req.body;

//         // Validate sectionId
//         if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid or missing sectionId",
//             });
//         }

//         // Delete the section
//         const deletedSection = await Section.findByIdAndDelete(sectionId);
//         if (!deletedSection) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Section not found",
//             });
//         }

//         // Remove the section reference from all courses
//         const updatedCourse = await Course.updateMany(
//             { sections: sectionId },                      // match section in array
//             { $pull: { sections: sectionId } }            // remove section from array
//         );

//         res.status(200).json({
//             success: true,
//             message: "Section deleted sucessfully",
//         });

//     } catch (error) {
//         console.error("Delete section error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server error. Please try again.",
//         });
//     }
// };






// const mongoose = require("mongoose");
// const Section = require('../models/Section');
// const Course = require('../models/Courses');
// const User = require('../models/User');

// exports.createSection = async (req, res) => {

//     try {
//         const { sectionName, courseId } = req.body;

//         if (!sectionName || !courseId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required'
//             });
//         }

//         const newSection = await Section.create({ sectionName });

//         // ✅ FIXED: Use courseContent since that's your model field
//         const updatedCourse = await Course.findByIdAndUpdate(
//             courseId,
//             { $push: { courseContent: newSection._id } },
//             { new: true }
//         )
//         .populate({
//             path: 'courseContent',
//             populate: { path: 'subSection' }
//         })
//         .exec();

//         if (!updatedCourse) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Course not found'
//             });
//         }

//         console.log("Updated course courseContent:", updatedCourse.courseContent); // Debug log

//         console.log("this is upadated Course :", updatedCourse)
//         res.status(201).json({
//             success: true,
//             message: 'Section created successfully',
//             data: updatedCourse,
//         });

//     } catch (error) {
//         console.log("Create section error:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message || 'Server error. Please try again.'
//         });
//     }
// };

// exports.updateSection = async (req, res) => {
//     try {
//         const { sectionName, sectionId, courseId } = req.body;
        
//         if (!sectionName || !sectionId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required'
//             });
//         }

//         await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

//         // ✅ FIXED: Use courseContent and populate correctly
//         const updatedCourse = await Course.findById(courseId)
//             .populate({
//                 path: 'courseContent',
//                 populate: { path: 'subSection' }
//             })
//             .exec();

//         res.status(200).json({
//             success: true,
//             message: 'Section updated successfully',
//             data: updatedCourse  // Return full course instead of just section
//         });

//     } catch (error) {
//         console.log("Update section error:", error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error. Please try again.'
//         });
//     }
// }

// exports.deleteSection = async (req, res) => {
//     try {
//         const { sectionId, courseId } = req.body;

//         if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid or missing sectionId",
//             });
//         }

//         // Delete the section
//         const deletedSection = await Section.findByIdAndDelete(sectionId);
//         if (!deletedSection) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Section not found",
//             });
//         }

//         // Remove the section reference from the course and get updated course
//         const updatedCourse = await Course.findByIdAndUpdate(
//             courseId,
//             { $pull: { courseContent: sectionId } },
//             { new: true }
//         )
//         .populate({
//             path: 'courseContent',
//             populate: { path: 'subSection' }
//         })
//         .exec();

//         res.status(200).json({
//             success: true,
//             message: "Section deleted successfully",
//             data: updatedCourse  // ✅ Return updated course
//         });

//     } catch (error) {
//         console.error("Delete section error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server error. Please try again.",
//         });
//     }
// };


const mongoose = require("mongoose");
const Section = require('../models/Section.js');
const Course = require('../models/Courses.js');
const User = require('../models/User.js');

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newSection = await Section.create({ sectionName });

        // ✅ FIXED: Use courseContent since that's your model field
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
        )
        .populate({
            path: 'courseContent',
            populate: { path: 'SubSection' }  // ✅ Using singular as you confirmed
        })
        .exec();

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        console.log("Updated course courseContent:", updatedCourse.courseContent); // Debug log

        res.status(201).json({
            success: true,
            message: 'Section created successfully',
            data: updatedCourse
        });

    } catch (error) {
        console.log("Create section error:", error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error. Please try again.'
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId, courseId } = req.body;
        
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        // ✅ FIXED: Use courseContent and populate correctly
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: { path: 'SubSection' }
            })
            .exec();

        res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            data: updatedCourse  // Return full course instead of just section
        });

    } catch (error) {
        console.log("Update section error:", error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
}

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;

        if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing sectionId",
            });
        }

        // Delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Remove the section reference from the course and get updated course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { courseContent: sectionId } },
            { new: true }
        )
        .populate({
            path: 'courseContent',
            populate: { path: 'SubSection' }
        })
        .exec();

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: updatedCourse  // ✅ Return updated course
        });

    } catch (error) {
        console.error("Delete section error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
};




