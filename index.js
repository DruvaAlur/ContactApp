const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { JWTPayload } = require("./View/Authentication");
const cookieParser = require("cookie-parser");

const {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} = require("./Contact/controller.js");
const {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
  createAdmin,
  isValidAdmin,
  toogleActiveFlag,
  getAllUsersCount,
} = require("./User/controller.js");
const { createContactDetail } = require("./ContactDetail/controller.js");
const { login } = require("./Login/controller.js");
const { logout } = require("./Logout/controller.js");
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/api/v1/login", (req, resp) => {
  login(req, resp);
});
app.post("/api/v1/createUser", async (req, resp) => {
  createUser(req, resp);
});
app.post("/api/v1/createContact/:username", (req, resp) => {
  createContact(req, resp);
});
app.post("/api/v1/createContactDetail/:username", (req, resp) => {
  createContactDetail(req, resp);
});
app.get("/api/v1/getContacts/:username", (req, resp) => {
  getContacts(req, resp);
});
app.post("/api/v1/getUsers", (req, resp) => {
  getUsers(req, resp);
});
app.post("/api/v1/getAllUsersCount", (req, resp) => {
  getAllUsersCount(req, resp);
});
app.post("/api/v1/deleteUser", (req, resp) => {
  deleteUser(req, resp);
});
app.put("/api/v1/updateContact/:username", (req, resp) => {
  updateContact(req, resp);
});
app.post("/api/v1/deleteContact/:username", (req, resp) => {
  deleteContact(req, resp);
});
app.put("/api/v1/updateUser", (req, resp) => {
  // console.log("here++++++++++++++++");
  updateUser(req, resp);
});
app.post("/api/v1/logout", (req, resp) => {
  logout(req, resp);
});
app.post("/api/v1/toogleActiveFlag", (req, resp) => {
  ("inhere");
  toogleActiveFlag(req, resp);
});
app.post("/api/v1/isAdminLoggedIn/:username", (req, resp) => {
  console.log("inisadmin");
  JWTPayload.isAdminLoggedIn(req, resp);
});
app.post("/api/v1/isUserLoggedIn/:username", (req, resp) => {
  JWTPayload.isUserLoggedIn(req, resp);
});
app.listen(8800, async () => {
  await createAdmin();
  // console.log(User.allUsers);
  console.log("app started at port 8800");
});
