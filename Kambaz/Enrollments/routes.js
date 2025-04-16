import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.get("/api/enrollments", (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  });

  app.get("/api/users/:userId/enrollments", (req, res) => {
    let { userId } = req.params;
    
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  });

  app.get("/api/courses/:courseId/enrollments", (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  });

  app.get("/api/users/:userId/courses/:courseId/enrollments", (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    
    const enrollment = dao.findEnrollment(userId, courseId);
    if (enrollment) {
      res.json(enrollment);
    } else {
      res.sendStatus(404);
    }
  });

  app.post("/api/users/:userId/courses/:courseId/enrollments", (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    
    const enrollment = dao.createEnrollment(userId, courseId);
    res.json(enrollment);
  });

  app.delete("/api/users/:userId/courses/:courseId/enrollments", (req, res) => {
    let { userId, courseId } = req.params;
    
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    
    const status = dao.deleteEnrollment(userId, courseId);
    res.json(status);
  });
}