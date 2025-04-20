import mongoose from "mongoose";
import schema from "./schema.js";
const quizModel = mongoose.model("QuizModel", schema);
export default quizModel;