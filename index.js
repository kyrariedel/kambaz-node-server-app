import express from 'express';
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import session from "express-session";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';
import QuizRoutes from './Kambaz/Quizzes/routes.js';
import QuizResultsRoutes from './Kambaz/QuizResults/routes.js';
import QuestionRoutes from './Kambaz/Questions/routes.js';

import mongoose from "mongoose";
import "dotenv/config";
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/Kambaz"
mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log("Connected to the correct database");
    console.log("Current database:", mongoose.connection.name);
  })
  .catch(err => console.error("Database connection error:", err));

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
  }
 ));  
 const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: true, // was false
  };
  if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
      sameSite: "lax", // was none
      secure: true,
      domain: process.env.NODE_SERVER_DOMAIN,
    };
  }
  app.use(session(sessionOptions));
  
app.use(express.json());
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
QuizRoutes(app);
QuizResultsRoutes(app);
QuestionRoutes(app);

Lab5(app);
app.listen(process.env.PORT || 4000)