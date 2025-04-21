import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) =>  model.findOne({ username: username });
// export const findUserByCredentials = (username, password) =>  model.findOne({ username, password });
// export const findUserByCredentials = (username, password) => {
//   console.log("Attempting login with:", { username, password });
//   return model.findOne({ username, password })
//     .then(user => {
//       console.log("Found user:", user);
//       return user;
//     })
//     .catch(err => {
//       console.error("DB error:", err);
//       return null;
//     });
// };
export const findUserByCredentials = async (username, password) => {
  // Log the search attempt
  console.log(`Searching for user: ${username}`);
  
  // First try to find just the user by username
  const user = await model.findOne({ username: username });
  console.log("Found user:", user);
  
  // If user exists, check password
  if (user && user.password === password) {
    console.log("Password matches!");
    return user;
  } else if (user) {
    console.log("User found but password doesn't match");
    console.log(`Expected: ${user.password}, Got: ${password}`);
  } else {
    console.log("No user found with username:", username);
  }
  
  return null;
};
export const updateUser = (userId, user) =>  model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
export const findUsersByRole = (role) => model.find({ role: role });
export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};
