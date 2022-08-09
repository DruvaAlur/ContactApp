const { User } = require("../View/User.js");

const { JWTPayload } = require("../View/Authentication.js");
function createContact(req, resp) {
  // console.log(User.allUsers);
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  const { fname, lname } = req.body;
  console.log(username + "+++++++++++++++");
  if (username == null || fname == null || lname == null) {
    resp.status(400).send("please send all required parameters");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    resp.status(400).send("user doesnt exists");
  }

  const [newcontact, isContactExists] = User.allUsers[
    indexofUser
  ].createContact(fname, lname);
  // console.log(newcontact);
  if (!isContactExists) {
    resp.status(401).send("contact already exists");
    return;
  }
  resp.status(201).send(newcontact);
}
function getContacts(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  if (username == null) {
    resp.status(400).send("please send all required parameters");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    resp.status(400).send("user doesnt exists");
  }

  resp.status(201).send(User.allUsers[indexofUser].displayContact());
}
function updateContact(req, resp) {
  const isUser = JWTPayload.isValidUser(req, resp);
  if (!isUser) {
    return "unauthorized access";
  }
  const username = req.params.username;

  const propertTobeUpdated = req.body.propertyTobeUpdated;
  const value = req.body.value;
  const contactName = req.body.contactName;
  console.log(username);
  console.log(propertTobeUpdated);
  console.log(value);
  console.log(contactName);
  if (
    username == null ||
    propertTobeUpdated == null ||
    value == null ||
    contactName == null
  ) {
    return resp.status(400).send("please send all required parameters");
  }
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
}
function deleteContact(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  const { fullname } = req.body;
  if (username == null || fullname == null) {
    resp.status(400).send("please send all required parameters");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);
  // console.log(isUserActive);
  if (!isUserExists || !isUserActive) {
    resp.status(400).send("user doesnt exists");
  }
  resp.status(201).send(User.allUsers[indexofUser].deleteContact(fullname));
}
module.exports = { createContact, getContacts, updateContact, deleteContact };
