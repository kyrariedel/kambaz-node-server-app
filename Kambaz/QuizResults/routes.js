import * as dao from "./dao.js";
import * as quizzesDao from "../Quizzes/dao.js";
import * as questionsDao from "../Questions/dao.js";

export default function QuizAttemptsRoutes(app) {
  app.get("/api/students/:studentId/attempts", async (req, res) => {
    const { studentId } = req.params;
    const userId = req.session?.user?._id;
    
    if (userId !== studentId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    try {
      const attempts = await dao.findAttemptsByStudent(studentId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching attempts", error });
    }
  });

  app.get("/api/quizzes/:quizId/attempts", async (req, res) => {
    const { quizId } = req.params;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can view all attempts" });
    }
    
    try {
      const attempts = await dao.findAttemptsByQuiz(quizId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching attempts", error });
    }
  });

  app.get("/api/students/:studentId/quizzes/:quizId/attempts", async (req, res) => {
    const { studentId, quizId } = req.params;
    const userId = req.session?.user?._id;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (userId !== studentId && role !== "FACULTY") {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    try {
      const attempts = await dao.findAttemptsByStudentAndQuiz(studentId, quizId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching attempts", error });
    }
  });

  app.get("/api/attempts/:attemptId", async (req, res) => {
    const { attemptId } = req.params;
    const userId = req.session?.user?._id;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    try {
      const attempt = await dao.findAttemptById(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      if (attempt.student !== userId && role !== "FACULTY") {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: "Error fetching attempt", error });
    }
  });

  app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
    const { quizId } = req.params;
    const userId = req.session?.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const quiz = await quizzesDao.findQuizById(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      if (!quiz.published) {
        return res.status(403).json({ message: "Quiz is not published" });
      }
      
      if (quiz.multipleAttempts) {
        const attemptCount = await dao.getAttemptCount(userId, quizId);
        
        if (attemptCount >= quiz.attemptsAllowed) {
          return res.status(403).json({ 
            message: "Maximum attempts reached",
            attemptCount
          });
        }
      } else {
        const attemptCount = await dao.getAttemptCount(userId, quizId);
        
        if (attemptCount > 0) {
          return res.status(403).json({ 
            message: "Multiple attempts not allowed",
            attemptCount
          });
        }
      }
      
      const attempt = {
        quiz: quizId,
        student: userId,
        answers: [],
        totalPoints: quiz.points
      };
      
      const newAttempt = await dao.createAttempt(attempt);
      res.status(201).json(newAttempt);
    } catch (error) {
      res.status(500).json({ message: "Error creating attempt", error });
    }
  });

  app.put("/api/attempts/:attemptId/submit", async (req, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body;
    const userId = req.session?.user?._id;
    
    try {
      const attempt = await dao.findAttemptById(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      if (attempt.student !== userId) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      if (attempt.completed) {
        return res.status(400).json({ message: "Attempt already submitted" });
      }
      
      const quiz = await quizzesDao.findQuizById(attempt.quiz);
      const questions = await questionsDao.findQuestionsForQuiz(attempt.quiz);
      
      let score = 0;
      const gradedAnswers = answers.map(answer => {
        const question = questions.find(q => q._id === answer.question);
        let isCorrect = false;
        
        if (question) {
          if (question.questionType === "MULTIPLE_CHOICE" || question.questionType === "TRUE_FALSE") {
            const correctOption = question.options.find(opt => opt.isCorrect);
            isCorrect = correctOption && answer.selectedOption === correctOption.text;
          } else if (question.questionType === "FILL_BLANK") {
            isCorrect = question.possibleAnswers.some(
              ans => ans.toLowerCase() === answer.enteredAnswer?.toLowerCase()
            );
          }
          
          if (isCorrect) {
            score += question.points;
          }
        }
        
        return {
          ...answer,
          isCorrect
        };
      });
      
      const status = await dao.submitAttempt(
        attemptId, 
        gradedAnswers, 
        score,
        quiz.points
      );
      
      res.json({
        ...status,
        score,
        totalPoints: quiz.points
      });
    } catch (error) {
      res.status(500).json({ message: "Error submitting attempt", error });
    }
  });

  app.get("/api/students/:studentId/quizzes/:quizId/latest-attempt", async (req, res) => {
    const { studentId, quizId } = req.params;
    const userId = req.session?.user?._id;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (userId !== studentId && role !== "FACULTY") {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    try {
      const attempt = await dao.getLatestAttemptForQuiz(studentId, quizId);
      
      if (!attempt) {
        return res.status(404).json({ message: "No attempts found" });
      }
      
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest attempt", error });
    }
  });
}