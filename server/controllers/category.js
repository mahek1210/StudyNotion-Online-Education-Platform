const Category = require('../models/Category.js');

exports.createCategory = async (req, res) => {

    try {
        const {name,description} = req.body;
        
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                 error: "Please include all fields"
                });
        }

        const category = await Category.create({
            name,
            description
        });

        return res.status(201).json({
            success: true,
            data: Category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
};

exports.showAllCategories = async (req, res) => {

    try {
        // const category = await Category.find({},{name:1,description:1});
        const category = await Category.find({});


        return res.status(200).json({
            success: true,
            data: category
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

// exports.categoryPageDetails = async (req, res) => {
//     try {
//       const { categoryId } = req.body
  
//       // Get courses for the specified category
//       const selectedCategory = await Category.findById(categoryId)
//         .populate({
//           path: "course",
//           match: { status: "Published" },
//           populate: "ratingAndReviews",
//         })
//         .exec()
  
//       console.log("SELECTED COURSE", selectedCategory)
//       // Handle the case when the category is not found
//       if (!selectedCategory) {
//         console.log("Category not found.")
//         return res
//           .status(404)
//           .json({ success: false, message: "Category not found" })
//       }
//       // Handle the case when there are no courses
//       if (selectedCategory.course.length === 0) {
//         console.log("No courses found for the selected category.")
//         return res.status(404).json({
//           success: false,
//           message: "No courses found for the selected category.",
//         })
//       }
  
//       // Get courses for other categories
//       const categoriesExceptSelected = await Category.find({
//         _id: { $ne: categoryId },
//       })
//       let differentCategory = await Category.findOne(
//         categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
//           ._id
//       )
//         .populate({
//           path: "course",
//           match: { status: "Published" },
//         })
//         .exec()
//       console.log()
//       // Get top-selling courses across all categories
//       const allCategories = await Category.find()
//         .populate({
//           path: "course",
//           match: { status: "Published" },
//         })
//         .exec()
//       const allCourses = allCategories.flatMap((category) => category.course)
//       const mostSellingCourses = allCourses
//         .sort((a, b) => (b.sold || 0) - (a.sold || 0))
//         .slice(0, 10)
  
//       res.status(200).json({
//         success: true,
//         data: {
//           selectedCategory,
//           differentCategory,
//           mostSellingCourses,
//         },
//       })
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       })
//     }
//   }

exports.categoryPageDetails = async (req, res) => {
  try {
    console.log("In categoryPageDetails in backend controller");
    const { categoryId } = req.body || req.query.categoryId || req.params.categoryId;
    console.log("Category ID:", categoryId);

    // Get selected category with published courses
    const selectedCategory = await Category.findById(categoryId)
    .populate({
      path: "course", // ✅ match your schema
      match: { status: "Published" },
      populate: { path: "ratingAndReviews" },
    })
    .exec();
    
    if (!selectedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    
    // first option for this atlest one course for each category
    if (!selectedCategory.course || selectedCategory.course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

  //   // second option for no course for this category
  //   if (!selectedCategory.course || selectedCategory.course.length === 0) {
  // console.warn("No published courses found for category:", categoryId);
  // // Still return success, but with empty courses array
// }

// let courses = selectedCategory.course;
// if (courses.length === 0) {
//   // Populate without status filter
//   const fallbackCategory = await Category.findById(categoryId)
//     .populate("course")
//     .exec();
//   courses = fallbackCategory.course;
// }


// Get a random different category
const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });
const randomIndex = Math.floor(Math.random() * categoriesExceptSelected.length);

const differentCategory = await Category.findById(categoriesExceptSelected[randomIndex]._id)
.populate({
  path: "course", // ✅ match your schema
  match: { status: "Published" },
})
.exec();

// Get top selling courses across all categories
const allCategories = await Category.find()
.populate({
  path: "course", // ✅ match your schema
  match: { status: "Published" },
})
.exec();

const allCourses = allCategories.flatMap((category) => category.course || []);

const mostSellingCourses = allCourses
.sort((a, b) => (b.sold || 0) - (a.sold || 0))
.slice(0, 10);
console.log("all good 1");
console.log("selectedCategory", selectedCategory);
console.log("differentCategory", differentCategory);
console.log("mostSellingCourses", mostSellingCourses);
      // console.log("all good 2");
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });

  } catch (error) {
    console.error("Error in categoryPageDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};





//   exports.categoryPageDetails = async (req, res) => {
//   try {
//     console.log("In categoryPageDetails in backend controller");
    
//     const categoryId = req.body.categoryId || req.query.categoryId || req.params.categoryId;
//     console.log("Category ID:", categoryId);

//     // Get selected category with published courses
//     const selectedCategory = await Category.findById(categoryId)
//       .populate({
//         path: "course", // ✅ check your schema field
//         match: { status: "Published" },
//         populate: { path: "ratingAndReviews" },
//       })
//       .exec();
    
//     if (!selectedCategory) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }

//     if (!selectedCategory.courses || selectedCategory.courses.length === 0) {
//       console.warn("No published courses found for category:", categoryId);
//     }

//     // Get a random different category
//     const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });
//     let differentCategory = null;
//     if (categoriesExceptSelected.length > 0) {
//       const randomIndex = Math.floor(Math.random() * categoriesExceptSelected.length);
//       differentCategory = await Category.findById(categoriesExceptSelected[randomIndex]._id)
//         .populate({
//           path: "course", // ✅ check schema
//           match: { status: "Published" },
//         })
//         .exec();
//     }

//     // Get top selling courses across all categories
//     const allCategories = await Category.find()
//       .populate({
//         path: "course", // ✅ check schema
//         match: { status: "Published" },
//       })
//       .exec();

//     const allCourses = allCategories.flatMap((category) => category.courses || []);

//     const mostSellingCourses = allCourses
//       .sort((a, b) => (b.sold || 0) - (a.sold || 0))
//       .slice(0, 10);

//     res.status(200).json({
//       success: true,
//       data: {
//         selectedCategory,
//         differentCategory,
//         mostSellingCourses,
//       },
//     });

//   } catch (error) {
//     console.error("Error in categoryPageDetails:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
