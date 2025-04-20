import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export async function findAttemptById(attemptId) {
  return await model.findById(attemptId);
}

export async function findAttemptsByStudent(studentId) {
  return await model.find({ student: studentId });
}

export async function findAttemptsByQuiz(quizId) {
  return await model.find({ quiz: quizId });
}

export async function findAttemptsByStudentAndQuiz(studentId, quizId) {
  return await model.find({ 
    student: studentId, 
    quiz: quizId 
  }).sort({ attemptNumber: -1 });
}

export async function createAttempt(attempt) {
  const attempts = await findAttemptsByStudentAndQuiz(
    attempt.student,
    attempt.quiz
  );
  
  const attemptNumber = attempts.length > 0 ? 
    attempts[0].attemptNumber + 1 : 1;
  
  const newAttempt = { 
    ...attempt, 
    _id: uuidv4(), 
    attemptNumber 
  };
  
  return await model.create(newAttempt);
}

export async function updateAttempt(attemptId, attemptUpdates) {
  return await model.updateOne(
    { _id: attemptId }, 
    attemptUpdates
  );
}

export async function submitAttempt(attemptId, answers, score, totalPoints) {
  return await model.updateOne(
    { _id: attemptId },
    { 
      answers,
      score,
      totalPoints,
      endTime: Date.now(),
      completed: true
    }
  );
}

export async function getLatestAttemptForQuiz(studentId, quizId) {
  const attempts = await findAttemptsByStudentAndQuiz(studentId, quizId);
  return attempts.length > 0 ? attempts[0] : null;
}

export async function getAttemptCount(studentId, quizId) {
  const attempts = await findAttemptsByStudentAndQuiz(studentId, quizId);
  return attempts.length;
}