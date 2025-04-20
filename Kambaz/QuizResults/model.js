import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("quizResultsModel", schema);
export default model;