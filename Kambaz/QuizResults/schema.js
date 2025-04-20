import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    student: { type: String, ref: "UserModel" },
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    answers: [{
      question: { type: String, ref: "QuestionModel" },
      selectedOption: String, // all other
      enteredAnswer: String, // fill in blank
      isCorrect: { type: Boolean, default: false }
    }],
    completed: { type: Boolean, default: false },
    attemptNumber: { type: Number, default: 1 }
  },
  { collection: "quiz-attempts" }
);

export default schema;