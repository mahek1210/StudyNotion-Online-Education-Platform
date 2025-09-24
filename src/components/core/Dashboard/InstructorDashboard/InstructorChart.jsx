// import { useState } from "react"
// import { Chart, registerables } from "chart.js"
// import { Pie } from "react-chartjs-2"

// Chart.register(...registerables)

// export default function InstructorChart({ courses }) {
//   // State to keep track of the currently selected chart
//   const [currChart, setCurrChart] = useState("students")

//   // Function to generate random colors for the chart
//   const generateRandomColors = (numColors) => {
//     const colors = []
//     for (let i = 0; i < numColors; i++) {
//       const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
//         Math.random() * 256
//       )}, ${Math.floor(Math.random() * 256)})`
//       colors.push(color)
//     }
//     return colors
//   }

//   // Data for the chart displaying student information
//   const chartDataStudents = {
//     labels: courses.map((course) => course.courseName),
//     datasets: [
//       {
//         data: courses.map((course) => course.totalStudentsEnrolled),
//         backgroundColor: generateRandomColors(courses.length),
//       },
//     ],
//   }

//   // Data for the chart displaying income information
//   const chartIncomeData = {
//     labels: courses.map((course) => course.courseName),
//     datasets: [
//       {
//         data: courses.map((course) => course.totalAmountGenerated),
//         backgroundColor: generateRandomColors(courses.length),
//       },
//     ],
//   }

//   // Options for the chart
//   const options = {
//     maintainAspectRatio: false,
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
//       <p className="text-lg font-bold text-richblack-5">Visualize</p>
//       <div className="space-x-4 font-semibold">
//         {/* Button to switch to the "students" chart */}
//         <button
//           onClick={() => setCurrChart("students")}
//           className={`rounded-sm p-1 px-3 transition-all duration-200 ${
//             currChart === "students"
//               ? "bg-richblack-700 text-yellow-50"
//               : "text-yellow-400"
//           }`}
//         >
//           Students
//         </button>
//         {/* Button to switch to the "income" chart */}
//         <button
//           onClick={() => setCurrChart("income")}
//           className={`rounded-sm p-1 px-3 transition-all duration-200 ${
//             currChart === "income"
//               ? "bg-richblack-700 text-yellow-50"
//               : "text-yellow-400"
//           }`}
//         >
//           Income
//         </button>
//       </div>
//       <div className="relative mx-auto aspect-square h-full w-full">
//         {/* Render the Pie chart based on the selected chart */}
//         <Pie
//           data={currChart === "students" ? chartDataStudents : chartIncomeData}
//           options={options}
//         />
//       </div>
//     </div>
//   )
// }



import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses = [] }) { // ✅ default empty array
  const [currChart, setCurrChart] = useState("students")

  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // ✅ If no courses, show empty chart labels/data
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName || "Untitled"),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled || 0),
        backgroundColor: generateRandomColors(courses.length || 0),
      },
    ],
  }

  const chartIncomeData = {
    labels: courses.map((course) => course.courseName || "Untitled"),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated || 0),
        backgroundColor: generateRandomColors(courses.length || 0),
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
  }

  // ✅ Optional: Handle empty courses
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-richblack-800 rounded-md">
        <p className="text-yellow-400">No course data available to visualize.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-full w-full">
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}
