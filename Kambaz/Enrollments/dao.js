import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAllEnrollments() {
  return Database.enrollments;
}

export function findEnrollmentsForUser(userId) {
  return Database.enrollments.filter((enrollment) => enrollment.user === userId);
}

export function findEnrollmentsForCourse(courseId) {
  return Database.enrollments.filter((enrollment) => enrollment.course === courseId);
}

export function findEnrollment(userId, courseId) {
  return Database.enrollments.find(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
}

export function createEnrollment(userId, courseId) {
  const existingEnrollment = findEnrollment(userId, courseId);
  if (existingEnrollment) {
    return existingEnrollment;
  }
  
  const newEnrollment = {
    _id: uuidv4(),
    user: userId,
    course: courseId,
    enrolledOn: new Date()
  };
  
  Database.enrollments = [...Database.enrollments, newEnrollment];
  return newEnrollment;
}

export function deleteEnrollment(userId, courseId) {
  Database.enrollments = Database.enrollments.filter(
    (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
  );
  return { status: "ok" };
}

export function deleteEnrollmentsByUserId(userId) {
  Database.enrollments = Database.enrollments.filter(
    (enrollment) => enrollment.user !== userId
  );
  return { status: "ok" };
}

export function deleteEnrollmentsByCourseId(courseId) {
  Database.enrollments = Database.enrollments.filter(
    (enrollment) => enrollment.course !== courseId
  );
  return { status: "ok" };
}