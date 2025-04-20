import * as dao from "./dao.js";

export default function QuizzesRoutes(app) {
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    const { courseId } = req.params;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    try {
      let quizzes;
      if (role === "FACULTY") {
        quizzes = await dao.findQuizzesForCourse(courseId);
      } else {
        quizzes = await dao.findPublishedQuizzesForCourse(courseId);
      }
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quizzes", error });
    }
  });

  app.get("/api/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    try {
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quiz", error });
    }
  });

  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    const { courseId } = req.params;
    const { role, _id } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can create quizzes" });
    }
    
    try {
      const quiz = {
        ...req.body,
        course: courseId,
        createdBy: _id
      };
      const newQuiz = await dao.createQuiz(quiz);
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ message: "Error creating quiz", error });
    }
  });

  app.put("/api/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can update quizzes" });
    }
    
    try {
      const status = await dao.updateQuiz(quizId, req.body);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error updating quiz", error });
    }
  });

  app.delete("/api/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can delete quizzes" });
    }
    
    try {
      const status = await dao.deleteQuiz(quizId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error deleting quiz", error });
    }
  });

  app.put("/api/quizzes/:quizId/publish", async (req, res) => {
    const { quizId } = req.params;
    const { published } = req.body;
    const { role } = req.session?.user || { role: "STUDENT" };
    
    if (role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can publish quizzes" });
    }
    
    try {
      const status = await dao.publishQuiz(quizId, published);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error publishing quiz", error });
    }
  });
}