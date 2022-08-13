const { User } = require("../../View/User");

const { JWTPayload } = require("../../View/Authentication.js");
function createContactDetail(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;

  const { type, value, fullname } = req.body;
  if (username == null || fullname == null || value == null || type == null) {
    return resp.status(400).send("please send all required parameters");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  if (!isUserExists || !isUserActive) {
    return resp.status(400).send("user doesnt exists");
  }
  [indexOfContact, isContactActive, isContactExists] =
    User.allUsers[indexofUser].isContactExists(fullname);
  if (!isContactActive || !isContactExists) {
    return resp.status(400).send("contact doesnt exists");
  }
  let newContactDetail = User.allUsers[indexofUser].createContactDetail(
    fullname,
    type,
    value
  );
  console.log(username + "_______");
  console.log(fullname);
  console.log(type);
  console.log(value);
  if (newContactDetail == false) {
    return resp.status(401).send("Contact Detail Type Already Exists");
  }
  resp.status(201).send(newContactDetail);
}
module.exports = { createContactDetail };
