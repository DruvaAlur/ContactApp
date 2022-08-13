const { JWTPayload } = require("../../View/Authentication.js");
let [admin, message] = [null, "not Admin"];
const { User } = require("../../View/User");
async function createAdmin() {
  [admin, message] = await User.createAdmin();
}
async function createUser(req, resp) {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);

  if (!isValidAdmin) {
    return;
  }
  const { fname, lname, username, password, role } = req.body;

  if (
    lname == null ||
    fname == null ||
    password == null ||
    role == null ||
    lname == "" ||
    fname == "" ||
    password == "" ||
    role == "" ||
    username == "" ||
    username == null
  ) {
    return resp.status(401).send("please fill all fields in the form");
  }
  let [newUser, message] = await admin.createUser(
    fname,
    lname,
    username,
    password,
    role
  );
  if (newUser == null) {
    resp.status(401).send(message);
    return;
  }
  resp.status(201).send(newUser);
  return message;
}
function getUsers(req, resp) {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return "please login";
  }
  const { limit, pageNumber } = req.body;
  // console.log(limit + "{}");
  // console.log(pageNumber);
  if (User.allUsers.length === 0) {
    return resp.status(400).send("No users yet");
  }
  let startIndex = (pageNumber - 1) * limit;
  let endIndex = pageNumber * limit;

  resp.status(200).send(User.allUsers.slice(startIndex, endIndex));
}

function deleteUser(req, resp) {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return "not valid admin please login as admin";
  }
  const { usernameOfUserToBeDeleted } = req.body;
  if (usernameOfUserToBeDeleted == null) {
    resp.status(400).send("please send all required parameters");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(
    usernameOfUserToBeDeleted
  );

  if (!isUserExists || !isUserActive) {
    resp.status(400).send("user doesnt exists");
  } else {
    admin.deleteUser(usernameOfUserToBeDeleted);

    resp.status(200).send("user deleted");
  }
}
function updateUser(req, resp) {
  // console.log(User.allUsers);
  // console.log("+++++++++++++++++++");
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return;
  }

  const { username, propertyToUpdate, value } = req.body;
  // console.log(username + "{{}{}}}");
  if (
    username == null ||
    propertyToUpdate == null ||
    value == null ||
    username == "" ||
    propertyToUpdate == "" ||
    value == ""
  ) {
    return resp.status(400).send("please fill all fields in the form");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    return resp.status(400).send("user doesnt exists");
  }
  // console.log("++");

  let isUpdateSuccess = User.allUsers[indexofUser].updateUser(
    propertyToUpdate,
    value
  );
  if (isUpdateSuccess) {
    return resp.status(200).send("update success");
  }
  return resp.status(400).send("update failed");
}
function isValidAdmin(req, resp) {
  JWTPayload.isValidAdmin(req, resp);
  return;
}
function toogleActiveFlag(req, resp) {
  const userId = req.body.userId;
  // console.log(userId);
  // console.log(User.allUsers[0].userId);
  let [userIndex, isUserActive, isUserExists] = User.isUserIdExists(userId);
  // console.log(userIndex);
  User.allUsers[userIndex].isActive
    ? (User.allUsers[userIndex].isActive = false)
    : (User.allUsers[userIndex].isActive = true);
  // console.log(User.allUsers);
  resp.status(201).send("update done");
}
function getAllUsersCount(req, resp) {
  // console.log(User.allUsers.length + "+++");
  resp.status(200).send(User.allUsers.length.toString());
}
module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
  createAdmin,
  isValidAdmin,
  toogleActiveFlag,
  getAllUsersCount,
};
