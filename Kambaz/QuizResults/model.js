import mongoose from "mongoose";
import schema from "./schema.js";
const quizResultsModel = mongoose.model("quizResultsModel", schema);
export default quizResultsModel;