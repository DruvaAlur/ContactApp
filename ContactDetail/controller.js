const { User } = require("../View/User.js");

const { JWTPayload } = require("../View/Authentication.js");
function createContactDetail(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;

  const { type, value, fullname } = req.body;
  if (username == null || fullname == null || value == null || type == null) {
    resp.status(400).send("please send all required parameters");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    resp.status(400).send("user doesnt exists");
  }
  [indexOfContact, isContactActive, isContactExists] =
    User.allUsers[indexofUser].isContactExists(fullname);
  if (!isContactActive || !isContactExists) {
    resp.status(400).send("contact doesnt exists");
  }
  let newContactDetail = User.allUsers[indexofUser].createContactDetail(
    fullname,
    type,
    value
  );

  resp.status(201).send(newContactDetail);
}
module.exports = { createContactDetail };
