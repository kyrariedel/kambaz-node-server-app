import * as dao from "./dao.js";

export default function QuestionsRoutes(app) {
  app.get("/api/quizzes/:quizId/questions", async (req, res) => {
    const { quizId } = req.params;
    try {
      const questions = await dao.findQuestionsForQuiz(quizId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching questions", error });
    }
  });

  app.get("/api/questions/:questionId", async (req, res) => {
    const { questionId } = req.params;
    try {
      const question = await dao.findQuestionById(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Error fetching question", error });
    }
  });

  app.post("/api/quizzes/:quizId/questions", async (req, res) => {
    const { quizId } = req.params;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can create questions" });
    }
    
    try {
      const question = {
        ...req.body,
        quiz: quizId
      };
      const newQuestion = await dao.createQuestion(question);
      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).json({ message: "Error creating question", error });
    }
  });

  app.put("/api/questions/:questionId", async (req, res) => {
    const { questionId } = req.params;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can update questions" });
    }
    
    try {
      const status = await dao.updateQuestion(questionId, req.body);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error updating question", error });
    }
  });

  app.delete("/api/questions/:questionId", async (req, res) => {
    const { questionId } = req.params;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can delete questions" });
    }
    
    try {
      const status = await dao.deleteQuestion(questionId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error deleting question", error });
    }
  });

  app.put("/api/quizzes/:quizId/questions/reorder", async (req, res) => {
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can reorder questions" });
    }
    
    try {
      const status = await dao.reorderQuestions(req.body);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error reordering questions", error });
    }
  });
}