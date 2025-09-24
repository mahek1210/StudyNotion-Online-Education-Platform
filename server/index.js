const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path  = require("path");

dotenv.config();
const PORT = process.env.PORT || 4000;

database.connect();
cloudinaryConnect();
 
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../build')));
// app.use(
// 	cors({
// 		origin: "*",
// 		credentials: true,
// 	})
// );

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);     

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
// Testing the server

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// In your Express route file (like routes/test.js or directly in app.js)
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is working!" });
});


// End of code.




// const express = require("express");
// const app = express();
// const userRoutes = require("./routes/user");
// const profileRoutes = require("./routes/profile");
// const courseRoutes = require("./routes/Course");
// const paymentRoutes = require("./routes/Payments");
// const contactUsRoute = require("./routes/Contact");
// const database = require("./config/database");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const { cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
// const dotenv = require("dotenv");

// dotenv.config();
// const PORT = process.env.PORT || 4000;

// database.connect();
// cloudinaryConnect();
 
// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(
// 	cors({
// 		origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Frontend URLs
// 		credentials: true,
// 		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 		allowedHeaders: ['Content-Type', 'Authorization']
// 	})  
// );
// app.use( 
// 	fileUpload({
// 		useTempFiles: true,
// 		tempFileDir: "/tmp/",
// 	})
// );

// // Setting up routes - FIXED PATHS
// app.use("/api/v1/auth", userRoutes);
// app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/reach", contactUsRoute);     

// // Testing the server
// app.get("/", (req, res) => {
// 	return res.json({
// 		success: true,
// 		message: "Your server is up and running ...",
// 	});
// });

// // Test endpoint for frontend connection
// app.get("/api/v1/test", (req, res) => {
//   res.status(200).json({ 
//     success: true, 
//     message: "Backend is working!",
//     port: PORT,
//     timestamp: new Date().toISOString()
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
// 	console.error(err.stack);
// 	res.status(500).json({
// 		success: false,
// 		message: "Something went wrong!",
// 		error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
// 	});
// });

// // Handle 404 routes
// app.use('*', (req, res) => {
// 	res.status(404).json({
// 		success: false,
// 		message: `Route ${req.originalUrl} not found`
// 	});
// });

// // Listening to the server
// app.listen(PORT, () => {
// 	console.log(`🚀 Server is running on port ${PORT}`);
// 	console.log(`🔗 Backend URL: http://localhost:${PORT}`);
// 	console.log(`📡 Test endpoint: http://localhost:${PORT}/api/v1/test`);
// });

// module.exports = app;