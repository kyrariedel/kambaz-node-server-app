import model from "./model.js";
export function findAssignmentsForCourse(courseId) {
  return model.find({ course: courseId });
}
export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  return model.create(newAssignment);
}

export function deleteAssignment(assignmentId) {
  return model.deleteOne({ _id: assignmentId });
 }
 
 export function updateAssignment(assignmentId, assignmentUpdates) {
  return model.updateOne({ _id: assignmentId }, assignmentUpdates);
}
