const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { User } = require("./model/User.js");
const cookieParser = require("cookie-parser");
const { Contact } = require("./model/Contact.js");
const { JWTPayload } = require("./model/Authentication.js");
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
const [admin, message] = User.createAdmin();
app.post("/api/v1/login", (req, resp) => {
  const { username, password } = req.body;

  let [indexOfUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (
    !isUserExists ||
    User.allUsers[indexOfUser].credential.password != password
  ) {
    resp.status(504).send("Invalid Credentials");
    return;
  }
  const newPayload = new JWTPayload(User.allUsers[indexOfUser]);
  const newToken = newPayload.createToken();
  resp.cookie("myToken", newToken);
  resp.status(200).send("Loggin Done");
});
app.post("/api/v1/createUser", (req, resp) => {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return "not valid admin please login as admin";
  }
  const { fname, lname, username, password, role } = req.body;
  let [newUser, message] = admin.createUser(
    fname,
    lname,
    username,
    password,
    role
  );
  if (newUser == null) {
    resp.status(504).send(message);
    return;
  }
  resp.status(201).send(newUser);
  return message;
});
app.post("/api/v1/createContact/:username", (req, resp) => {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  const { fname, lname } = req.body;
  // console.log(username);
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    resp.status(200).send("user doesnt exists");
  } else {
    const newcontact = User.allUsers[indexofUser].createContact(fname, lname);
    // console.log(newcontact);
    resp.status(200).send(newcontact);
  }
});
app.post("/api/v1/createContactDetail/:username/:fname/:lname", (req, resp) => {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  const fname = req.params.fname;
  const lname = req.params.lname;
  const { type, value } = req.body;

  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    resp.status(200).send("user doesnt exists");
  }
  [indexOfContact, isContactActive, isContactExists] = User.allUsers[
    indexofUser
  ].isContactExists(fname, lname);
  if (!isContactActive || !isContactExists) {
    resp.status(200).send("contact doesnt exists");
  }
  let newContactDetail = User.allUsers[indexofUser].createContactDetail(
    fname,
    lname,
    type,
    value
  );

  resp.status(200).send(newContactDetail);
});
app.get("/api/v1/getContacts/:username", (req, resp) => {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    resp.status(200).send("user doesnt exists");
  }

  resp.status(200).send(User.allUsers[indexofUser].displayContact());
});
app.get("/api/v1/getUsers", (req, resp) => {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return "please login";
  }
  if (User.allUsers.length === 0) {
    resp.status(200).send("No users yet");
  }

  resp.status(200).send(User.displayUsers());
});
app.post("/api/v1/deleteUser", (req, resp) => {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return "not valid admin please login as admin";
  }
  const { username, usernameOfUserToBeDeleted } = req.body;

  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(
    usernameOfUserToBeDeleted
  );

  if (!isUserExists || !isUserActive) {
    resp.status(200).send("user doesnt exists");
  } else {
    admin.deleteUser(usernameOfUserToBeDeleted);

    resp.status(200).send("user deleted");
  }
});
app.put("/api/v1/updateContact/:username/:contactName", (req, resp) => {
  const isUser = JWTPayload.isValidUser(req, resp);
  if (!isUser) {
    return "unauthorized access";
  }
  const username = req.params.username;
  const contactName = req.params.contactName;
  const propertTobeUpdated = req.body.propertyTobeUpdated;
  const value = req.body.value;

  const [indexOfUser, isuseractive, isUserExist] = User.isUserExists(username);
  if (!isUserExist) {
    resp.status(504).send("invalid username");
  }

  const [isUpdated, UpdatedContact, message] = User.allUsers[
    indexOfUser
  ].updateContact(contactName, propertTobeUpdated, value);
  if (!isUpdated) {
    resp.status(504).send(message);
  }
  resp.status(200).send(UpdatedContact);
});
app.post("/api/v1/deleteContact/:username", (req, resp) => {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  const { fname, lname } = req.body;

  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);
  // console.log(isUserActive);
  if (!isUserExists || !isUserActive) {
    resp.status(200).send("user doesnt exists");
  }
  resp.status(200).send(User.allUsers[indexofUser].deleteContact(fname, lname));
});
app.put("/api/v1/updateUser/:username", (req, resp) => {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return;
  }
  const username = req.params.username;
  const { propertyToUpdate, value } = req.body;

  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    resp.status(200).send("user doesnt exists");
  }
  let isUpdateSuccess = User.allUsers[indexofUser].updateUser(
    propertyToUpdate,
    value
  );
  if (isUpdateSuccess) {
    resp.status(200).send("update success");
  }
  resp.status(200).send("update failed");
});
app.post("/api/v1/logout", (req, resp) => {
  resp.cookie("myToken", "none", {
    expires: new Date(Date.now() + 0 * 1000),
  });
  resp.status(200).send("User Logged out Successfully");
});
app.listen(8800, () => {
  console.log("app started at port 8800");
});
