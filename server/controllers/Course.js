const Course = require('../models/Courses.js');
const User = require('../models/User.js');
const Section = require('../models/Section.js');
const SubSection = require("../models/SubSection.js") 
// const Tag = require('../models/Tag');
// const Category = require('../models/Category');
const Category = require('../models/Category.js');
const CourseProgress = require('../models/CourseProgress.js');
// const { imageUploader } = require('../utils/imageUpaloder');
const imageUploader = require('../utils/imageUpaloder.js');
const convertSecondsToDuration = require('../utils/secToDuration.js').convertSecondsToDuration;

require('dotenv').config();

exports.createCourse = async (req, res) => {
   try{
    const { courseName, courseDescription, price, tag, whatYouWillLearn, category: categoryId } = req.body;
    const thumbnail = req.files?.thumbnailImage;
    console.log(req.body);
    console.log("Thumbnail object:", thumbnail);
    
   if (!courseName || !courseDescription || !price || !tag || !whatYouWillLearn || !categoryId) {
  console.log("All fields are required");
  return res.status(400).json({
    success: false,
    error: "All fields are required"
  });
}

    console.log("all good");
//     console.log("Thumbnail object:", thumbnail);
// console.log("Temp file path:", thumbnail.tempFilePath);

    const CategoryDetails = await Category.findById(categoryId);
    if(!CategoryDetails){
        return res.status(400).json({
            success: false,
            error: "Invalid Category"
        });
    }
        // console.log("all good1");


    // console.log("all good2");
  //  Upload Image
    let thumbnailImage;
    try {
      thumbnailImage = await imageUploader(thumbnail, process.env.FOLDER_NAME, 300, 70);
    } catch (uploadErr) {
      console.error("Image upload failed:", uploadErr);
      return res.status(500).json({
        success: false,
        error: "Thumbnail upload failed",
        message: uploadErr.message
      });
    }

    // console.log("good 3");
    //
   let parsedTags;
  try {
  parsedTags = typeof tag === "string" ? JSON.parse(tag) : tag;
} catch (err) {
  return res.status(400).json({
    success: false,
    error: "Tags must be a valid JSON array of strings"
  });
}
//
// console.log("Parsed Tags:", parsedTags);
// console.log("Instructor object:", req.user);
// console.log("Instructor ID:", req.user?.id);


    const newCourse = await Course.create({
        courseName,
        courseDescription,
        price,
        Tags: parsedTags,
        Category: CategoryDetails._id,
        whatYouWillLearn,
        instructor: req.user.id,
        thumbnail: thumbnailImage.secure_url
    });


    // console.log("all good3.1");

    await User.findByIdAndUpdate(req.user.id,{
        $push: { courses: newCourse._id }
    },
    {
        new: true
    });

    // console.log("all good4");
    // //update tag schema
    await Category.findByIdAndUpdate(CategoryDetails._id,{
        $push: { course: newCourse._id }
    },
    {
        new: true
    });

    return res.status(201).json({
        success: true,
        data: newCourse
    });
    
   }
    catch(err){
     return res.status(500).json({
          success: false,
          error: "Server Error",
          mesage: err.message
     });
    }
}

exports.getAllCourses = async (req, res) => {
    try{
        const courses = await Course.find().populate()
        return res.status(200).json({
            success: true,
            data: courses
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

// exports.createCourse = async (req, res) => {
//   try {
//     const { courseName, courseDescription, Price, Tags, WhatYouWillLearn, Category } = req.body;
//     const thumbnail = req.files?.thumbnail;

//     // Parse Tags
//     let parsedTags;
//     try {
//       parsedTags = JSON.parse(Tags);
//     } catch (e) {
//       return res.status(400).json({
//         success: false,
//         error: "Tags must be a valid JSON array"
//       });
//     }
//     console.log("Parsed Tags:", parsedTags);

//     // Validation
//     if (!courseName || !courseDescription || !Price  || !WhatYouWillLearn || !thumbnail || !Category) {
//       console.log("All fields are required");
//       return res.status(400).json({
//         success: false,
//         error: "All fields are required"
//       });
//     }
//     console.log("All fields validated");
//     console.log("Category typeof:", typeof Category); // Should print: "function"

//     // Check Category
//     const CategoryDetails = await Category.findById(Category);
//     if (!CategoryDetails) {
//       return res.status(400).json({
//         success: false,
//         error: "Invalid Category"
//       });
//     }
//     console.log("Category validated");

//     // Upload Image
//     let thumbnailImage;
//     try {
//       thumbnailImage = await imageUploader(thumbnail, process.env.FOLDERNAME, 300, 70);
//     } catch (uploadErr) {
//       console.error("Image upload failed:", uploadErr);
//       return res.status(500).json({
//         success: false,
//         error: "Thumbnail upload failed"
//       });
//     }

//     // Create Course
//     const newCourse = await Course.create({
//       courseName,
//       courseDescription,
//       Price,
//       Tags: parsedTags,
//       Category: CategoryDetails._id,
//       WhatYouWillLearn,
//       instructor: req.user._id,
//       thumbnail: thumbnailImage.secure_url
//     });

//     // Add course to instructor
//     await User.findByIdAndUpdate(req.user._id, {
//       $push: { courses: newCourse._id }
//     });

//     return res.status(201).json({
//       success: true,
//       data: newCourse
//     });

//   } catch (err) {
//     console.error("Error in createCourse:", err);
//     return res.status(500).json({
//       success: false,
//       error: "Server Error"
//     });
//   }
// };


// exports.getCourseDetails = async (req, res) => {
//     try {
//       const { courseId } = req.body
//       const courseDetails = await Course.findOne({
//         _id: courseId,
//       })
//         .populate({
//           path: "instructor",
//           populate: {
//             path: "additionalDetails",
//           },
//         })
//         .populate("Category")
//         .populate("ratingAndReviews")
//         .populate({
//           path: "courseContent",
//           populate: {
//             path: "subSection",
//             select: "-videoUrl",
//           },
//         })
//         .exec()
  
//       if (!courseDetails) {
//         return res.status(400).json({
//           success: false,
//           message: `Could not find course with id: ${courseId}`,
//         })
//       }
  
//       // if (courseDetails.status === "Draft") {
//       //   return res.status(403).json({
//       //     success: false,
//       //     message: `Accessing a draft course is forbidden`,
//       //   });
//       // }
  
//       let totalDurationInSeconds = 0
//       courseDetails.courseContent.forEach((content) => {
//         content.subSection.forEach((subSection) => {
//           const timeDurationInSeconds = parseInt(subSection.timeDuration)
//           totalDurationInSeconds += timeDurationInSeconds
//         })
//       })
  
//       const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
//       return res.status(200).json({
//         success: true,
//         data: {
//           courseDetails,
//           totalDuration,
//         },
//       })
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       })
//     }
//   }


exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    console.log("getCourseDetails called");
    console.log("Course ID:", courseId);
    
    // Validate courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Find course with all necessary populations
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("Category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl", // Exclude video URL for security
        },
      })
      .exec();

    // Check if course exists
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Could not find course with the given ID",
      });
    }

    // Calculate total duration (optional)
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0;
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    });
    
  } catch (error) {
    console.error("Error in getCourseDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// // Helper function to convert seconds to readable duration
// const convertSecondsToDuration = (totalSeconds) => {
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = Math.floor((totalSeconds % 3600) % 60);

//   if (hours > 0) {
//     return `${hours}h ${minutes}m`;
//   } else if (minutes > 0) {
//     return `${minutes}m ${seconds}s`;
//   } else {
//     return `${seconds}s`;
//   }
// };


  // exports.getFullCourseDetails = async (req, res) => {
  //   try {
  //     // console.log("getFullCourseDetails called");
  //     const { courseId } = req.body
  //     const userId = req.user.id
  //     const courseDetails = await Course.findOne({
  //       _id: courseId,
  //     })
  //       .populate({
  //         path: "instructor",
  //         populate: {
  //           path: "additionalDetails",
  //         },
  //       })
  //       .populate("Category")
  //       .populate("ratingAndReviews")
  //       .populate({
  //         path: "courseContent",
  //         populate: {
  //           path: "SubSection",
  //         },
  //       })
  //       .exec()
  
  //     let courseProgressCount = await CourseProgress.findOne({
  //       courseID: courseId,
  //       userId: userId,
  //     })
  
  //     console.log("courseProgressCount : ", courseProgressCount)
  
  //     if (!courseDetails) {
  //       return res.status(400).json({
  //         success: false,
  //         message: `Could not find course with id: ${courseId}`,
  //       })
  //     }
  
  //     // if (courseDetails.status === "Draft") {
  //     //   return res.status(403).json({
  //     //     success: false,
  //     //     message: `Accessing a draft course is forbidden`,
  //     //   });
  //     // }
  
  //     let totalDurationInSeconds = 0
  //     courseDetails.courseContent.forEach((content) => {
  //       content.SubSection.forEach((SubSection) => {
  //         const timeDurationInSeconds = parseInt(SubSection.timeDuration)
  //         totalDurationInSeconds += timeDurationInSeconds
  //       })
  //     })
  
  //     const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
  //     return res.status(200).json({
  //       success: true,
  //       data: {
  //         courseDetails,
  //         totalDuration,
  //         completedVideos: courseProgressCount?.completedVideos
  //           ? courseProgressCount?.completedVideos
  //           : [],
  //       },
  //     })
  //   } catch (error) {
  //     return res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     })
  //   }
  // }

  exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id

    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("Category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "SubSection", model: "SubSection" }, // ✅ capital S
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // ✅ calculate duration safely
    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((sec) => {
      ;(sec?.SubSection ?? []).forEach((sub) => {
        const secs =
          typeof sub.timeDuration === "number"
            ? sub.timeDuration
            : (typeof sub.timeDuration === "string" &&
              sub.timeDuration.includes(":"))
            ? (() => {
                const [m, s] = sub.timeDuration.split(":").map(Number)
                return (m || 0) * 60 + (s || 0)
              })()
            : parseInt(sub.timeDuration) || 0

        totalDurationInSeconds += secs
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

  
  // Get a list of Course for a given Instructor
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
      // console.log("Instructor ID:", instructorId);
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }

  
  exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = { ...req.body }
    const course = await Course.findById(courseId)
    console.log("in edit course section in backend ");
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

const updatedCourse = await Course.findOne({ _id: courseId })
  .populate({
    path: "instructor",
    populate: {
      path: "additionalDetails",
    },
  })
  .populate("Category")
  .populate("ratingAndReviews")
  .populate({
    path: "courseContent",   // Section
    populate: {
      path: "SubSection",    // SubSection inside Section
      model: "SubSection",   // 👈 explicitly add model
    },
  })
  .exec();


    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
  // Delete the Course

  // exports.deleteCourse = async (req, res) => {
  //   try {
  //     const { courseId } = req.body
      
  //     console.log("deleteeCourse called");
  //     console.log("courseId in deleteCourse:", courseId);
  //     // Find the course
  //     const course = await Course.findById(courseId)
  //     if (!course) {
  //       return res.status(404).json({ message: "Course not found" })
  //     }
  
  //     // Unenroll students from the course
  //       const studentsEnrolled = course.studentEnrolled  // ✅ Correct spelling
  //     for (const studentId of studentsEnrolled) {
  //       await User.findByIdAndUpdate(studentId, {
  //         $pull: { courses: courseId },
  //       })
  //     }
  
  //     // Delete sections and sub-sections
  //     const courseSections = course.courseContent
  //     for (const sectionId of courseSections) {
  //       // Delete sub-sections of the section
  //       const section = await section.findById(sectionId)
  //       if (section) {
  //         const subSections = section.subSection
  //         for (const subSectionId of subSections) {
  //           await subSectionId.findByIdAndDelete(subSectionId)
  //         }
  //       }
  
  //       // Delete the section
  //       await section.findByIdAndDelete(sectionId)
  //     }
  
  //     // Delete the course
  //     await Course.findByIdAndDelete(courseId)
  
  //     return res.status(200).json({
  //       success: true,
  //       message: "Course deleted successfully",
  //     })
  //   } catch (error) {
  //     console.error(error)
  //     return res.status(500).json({
  //       success: false,
  //       message: "Server error",
  //       error: error.message,
  //     })
  //   }
  // }


  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      
      console.log("deleteCourse called");
      console.log("courseId in deleteCourse:", courseId);
      
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)  // Fixed: Section model name
        if (section) {
          const subSections = section.SubSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)  // Fixed: SubSection model name
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)  // Fixed: Section model name
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }


