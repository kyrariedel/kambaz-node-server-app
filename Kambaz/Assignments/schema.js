import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    dueDate: Date,
    points: Number,
    course: { type: String, ref: "CourseModel" },
  },
  { collection: "modules" }
);
export default schema;