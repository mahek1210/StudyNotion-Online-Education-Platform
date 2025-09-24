const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Courses');
const CourseProgress = require('../models/CourseProgress');
const  uploadImageToCloudinary  = require('../utils/imageUpaloder');

// Helper function to convert seconds to duration
const convertSecondsToDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// exports.updateProfile = async (req, res) => {
//   try {
//     const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
//     console.log("Update Profile request received:", req.body);
//     const id = req.user.id;

//     if (!contactNumber || !gender || !id || !dateOfBirth || !about) {
//       return res.status(400).json({
//         success: false,
//         msg: "Please enter all fields"
//       });
//     }
//     console.log("User ID:", id);
//     const userDetails = await User.findById(id);
//     const ProfileId = userDetails.additionalDetails;
//     const profileDetails = await Profile.findById(ProfileId);

//     console.log("dateOfBirth:", dateOfBirth);

//     profileDetails.dateOfBirth = dateOfBirth;
//     profileDetails.about = about;
//     profileDetails.ContactNumber = contactNumber;
//     profileDetails.gender = gender;

//     await profileDetails.save();

//     console.log("Profile updated successfully:", profileDetails);

//     return res.status(200).json({
//       success: true,
//       msg: "Profile updated successfully"
//     });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       msg: "Internal server error"
//     });
//   }
// };


exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    // console.log("Update Profile request received:", req.body);
    const id = req.user.id;

    if ( !gender || !id || !dateOfBirth || !about) {
      return res.status(400).json({
        success: false,
        msg: "Please enter all fields"
      });
    }

    // console.log("User ID:", id);
    const userDetails = await User.findById(id);
    // console.log("User Details:", userDetails);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    const ProfileId = userDetails.additionalDetails;
    // console.log("Profile ID:", ProfileId);
    if (!ProfileId) {
      return res.status(404).json({
        success: false,
        msg: "Profile reference missing for this user"
      });
    }

    const profileDetails = await Profile.findById(ProfileId);
    // console.log("Profile Details:", profileDetails);
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        msg: "Profile not found"
      });
    }

    // console.log("dateOfBirth:", dateOfBirth);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.ContactNumber = contactNumber; 
    profileDetails.gender = gender;

    await profileDetails.save();

    // console.log("Profile updated successfully:", profileDetails);

    // return res.status(200).json({
    //   success: true,
    //   msg: "Profile updated successfully"
    // });

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .lean();

    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      updatedUserDetails
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error"
    });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        msg: "User not found"
      });
    }

    const ProfileId = userDetails.additionalDetails;

    //remove user from courses's studentEnrolled array
    const courses = await Course.find({ studentEnrolled: id });
    courses.forEach(async course => {
      const index = course.studentEnrolled.indexOf(id);
      course.studentEnrolled.splice(index, 1);
      await course.save();
    });
    // check above function between two comments

    await Profile.findByIdAndDelete(ProfileId);
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      msg: "Account deleted successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error"
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id).populate('additionalDetails').exec();

    return res.status(200).json({
      success: true,
      data: userDetails
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error"
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    // console.log("Update Display Picture request received in backend");
    // Check if file is uploaded
    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No display picture provided",
      });
    }
    // console.log("Display picture file received:", req.files.displayPicture);


    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    // Upload image to Cloudinary
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    // Update user's profile image URL
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    // Success response
    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating display picture:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update display picture",
      error: error.message,
    });
  }
};


exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    // console.log("User ID:", userId);
    let userDetails = await User.findOne({
      _id: userId,
    })
      // .populate({
      //   path: "courses",
      //   populate: {
      //     path: "courseContent",
      //     populate: {
      //       path: "subSection",
      //     },
      //   },
      // })

      .populate({
        path: "courses",
        strictPopulate: false,
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })

      .exec()

    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.Courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.Courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.Courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.Courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +j
          userDetails.Courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.Courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.Courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.Courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// exports.instructorDashboard = async (req, res) => {
//   try {
//     const courseDetails = await Course.find({ instructor: req.user.id })

//     const courseData = courseDetails.map((course) => {
//       const totalStudentsEnrolled = course.studentEnrolled.length
//       const totalAmountGenerated = totalStudentsEnrolled * course.price

//       // Create a new object with the additional fields
//       const courseDataWithStats = {
//         _id: course._id,
//         courseName: course.courseName,
//         courseDescription: course.courseDescription,
//         // Include other course properties as needed
//         totalStudentsEnrolled,
//         totalAmountGenerated,
//       }

//       return courseDataWithStats
//     })

//     res.status(200).json({ courses: courseData })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: "Server Error" })
//   }
// }

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const students = Array.isArray(course.studentEnrolled) ? course.studentEnrolled : []
      const totalStudentsEnrolled = students.length
      const totalAmountGenerated = totalStudentsEnrolled * (course.price || 0)

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      }
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

