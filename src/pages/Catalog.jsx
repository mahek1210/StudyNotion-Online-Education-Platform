// import React, { useEffect, useState } from "react"
// import { useSelector } from "react-redux"
// import { useParams } from "react-router-dom"

// // import CourseCard from "../components/Catalog/CourseCard"
// // import CourseSlider from "../components/Catalog/CourseSlider"
// import Footer from "../components/Common/Footer"
// import Course_Card from "../components/core/Catalog/Course_Card"
// import Course_Slider from "../components/core/Catalog/Course_Slider"
// import { apiConnector } from "../services/apiConnector"
// import { categories } from "../services/apis"
// import { getCatalogPageData } from "../services/operations/pageAndComponntDatas"
// import Error from "./Error"

// function Catalog() {
//   const { loading } = useSelector((state) => state.profile)
//   const { catalogName } = useParams()
//   const [active, setActive] = useState(1)
//   const [catalogPageData, setCatalogPageData] = useState(null)
//   const [categoryId, setCategoryId] = useState("")
//   // Fetch All Categories
//   useEffect(() => {
//     ;(async () => {
//       try {
//         const res = await apiConnector("GET", categories.CATEGORIES_API)
//         const category_id = res?.data?.data?.filter(
//           (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
//         )[0]._id
//         setCategoryId(category_id)
//       } catch (error) {
//         console.log("Could not fetch Categories.", error)
//       }
//     })()
//   }, [catalogName])
//   useEffect(() => {
//     if (categoryId) {
//       ;(async () => {
//         try {
//           const res = await getCatalogPageData(categoryId)
//           setCatalogPageData(res)
//         } catch (error) {
//           console.log(error)
//         }
//       })()
//     }
//   }, [categoryId])

//   if (loading || !catalogPageData) {
//     return (
//       <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
//         <div className="spinner"></div>
//       </div>
//     )
//   }
//   if (!loading && !catalogPageData.success) {
//     return <Error />
//   }

//   return (
//     <>
//       {/* Hero Section */}
//       <div className=" box-content bg-richblack-800 px-4">
//         <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
//           <p className="text-sm text-richblack-300">
//             {`Home / Catalog / `}
//             <span className="text-yellow-25">
//               {catalogPageData?.data?.selectedCategory?.name}
//             </span>
//           </p>
//           <p className="text-3xl text-richblack-5">
//             {catalogPageData?.data?.selectedCategory?.name}
//           </p>
//           <p className="max-w-[870px] text-richblack-200">
//             {catalogPageData?.data?.selectedCategory?.description}
//           </p>
//         </div>
//       </div>

//       {/* Section 1 */}
//       <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
//         <div className="section_heading">Courses to get you started</div>
//         <div className="my-4 flex border-b border-b-richblack-600 text-sm">
//           <p
//             className={`px-4 py-2 ${
//               active === 1
//                 ? "border-b border-b-yellow-25 text-yellow-25"
//                 : "text-richblack-50"
//             } cursor-pointer`}
//             onClick={() => setActive(1)}
//           >
//             Most Populer
//           </p>
//           <p
//             className={`px-4 py-2 ${
//               active === 2
//                 ? "border-b border-b-yellow-25 text-yellow-25"
//                 : "text-richblack-50"
//             } cursor-pointer`}
//             onClick={() => setActive(2)}
//           >
//             New
//           </p>
//         </div>
//         <div>
//           <Course_Slider
//             Courses={catalogPageData?.data?.selectedCategory?.courses}
//           />
//         </div>
//       </div>
//       {/* Section 2 */}
//       <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
//         <div className="section_heading">
//           Top courses in {catalogPageData?.data?.differentCategory?.name}
//         </div>
//         <div className="py-8">
//           <Course_Slider
//             Courses={catalogPageData?.data?.differentCategory?.courses}
//           />
//         </div>
//       </div>

//       {/* Section 3 */}
//       <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
//         <div className="section_heading">Frequently Bought</div>
//         <div className="py-8">
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             {catalogPageData?.data?.mostSellingCourses
//               ?.slice(0, 4)
//               .map((course, i) => (
//                 <Course_Card course={course} key={i} Height={"h-[400px]"} />
//               ))}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   )
// }

// export default Catalog




import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import Footer from "../components/Common/Footer"
import Course_Card from "../components/core/Catalog/Course_Card"
import Course_Slider from "../components/core/Catalog/Course_Slider"
import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas"
import Error from "./Error"

function Catalog() {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  
  // Fetch All Categories
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const category_id = res?.data?.data?.filter(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        )[0]._id
        setCategoryId(category_id)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
    })()
  }, [catalogName])

  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          console.log("Catalog Page Data Response:", res) // Debug log
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [categoryId])

  // Debug log to see the data structure
  useEffect(() => {
    if (catalogPageData) {
      console.log("Full catalogPageData:", catalogPageData)
      console.log("Selected Category Courses:", catalogPageData?.data?.selectedCategory?.course)
      console.log("Different Category Courses:", catalogPageData?.data?.differentCategory?.course)
      console.log("Most Selling Courses:", catalogPageData?.data?.mostSellingCourses)
    }
  }, [catalogPageData])

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 - Courses to get you started */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          {/* FIXED: Changed 'courses' to 'course' */}
          {catalogPageData?.data?.selectedCategory?.course?.length > 0 ? (
            <Course_Slider
              Courses={catalogPageData?.data?.selectedCategory?.course}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-richblack-100">No courses found in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 2 - Top courses in other category */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
          {/* FIXED: Changed 'courses' to 'course' */}
          {catalogPageData?.data?.differentCategory?.course?.length > 0 ? (
            <Course_Slider
              Courses={catalogPageData?.data?.differentCategory?.course}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-richblack-100">No courses found</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 3 - Frequently Bought */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          {catalogPageData?.data?.mostSellingCourses?.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {catalogPageData?.data?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, i) => (
                  <Course_Card course={course} key={i} Height={"h-[400px]"} />
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-richblack-100">No popular courses found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Catalog