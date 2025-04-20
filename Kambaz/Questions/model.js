import mongoose from "mongoose";
import schema from "./schema.js";
const questionsModel = mongoose.model("QuestionsModel", schema);
export default questionsModel;