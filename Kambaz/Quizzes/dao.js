import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export async function findAllQuizzes() {
  return await model.find();
}

export async function findQuizById(quizId) {
  return await model.findById(quizId);
}

export async function findQuizzesForCourse(courseId) {
  return await model.find({ course: courseId });
}

export async function findPublishedQuizzesForCourse(courseId) {
  return await model.find({ course: courseId, published: true });
}

export async function createQuiz(quiz) {
  const newQuiz = { ...quiz, _id: uuidv4() };
  return await model.create(newQuiz);
}

export async function updateQuiz(quizId, quizUpdates) {
  return await model.updateOne({ _id: quizId }, quizUpdates);
}

export async function deleteQuiz(quizId) {
  return await model.deleteOne({ _id: quizId });
}

export async function publishQuiz(quizId, publishState) {
  return await model.updateOne(
    { _id: quizId },
    { published: publishState }
  );
}