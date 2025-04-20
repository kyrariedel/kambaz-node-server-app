import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export async function findQuestionsForQuiz(quizId) {
  return await model.find({ quiz: quizId }).sort({ order: 1 });
}

export async function findQuestionById(questionId) {
  return await model.findById(questionId);
}

export async function createQuestion(question) {
  const newQuestion = { ...question, _id: uuidv4() };
  return await model.create(newQuestion);
}

export async function updateQuestion(questionId, questionUpdates) {
  return await model.updateOne({ _id: questionId }, questionUpdates);
}

export async function deleteQuestion(questionId) {
  return await model.deleteOne({ _id: questionId });
}

export async function reorderQuestions(questions) {
  const updates = questions.map((question, index) => 
    model.updateOne(
      { _id: question._id },
      { order: index }
    )
  );
  
  return await Promise.all(updates);
}