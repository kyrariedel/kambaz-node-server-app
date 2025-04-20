import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    title: String,
    points: { type: Number, default: 1 },
    questionType: { 
      type: String, 
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK"],
      default: "MULTIPLE_CHOICE"
    },
    question: String,
    options: [{ 
      text: String, 
      isCorrect: Boolean 
    }],
    possibleAnswers: [String],
    order: { type: Number, default: 0 }
  },
  { collection: "questions" }
);

export default schema;