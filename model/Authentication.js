const jwt = require("jsonwebtoken");
const { Credential } = require("./Credential");
class JWTPayload {
  static secratekey = "strongPassword";
  constructor(user) {
    this.username = user.credential.username;
    this.role = user.role;
    this.firstName = user.firstName;
    this.isActive = user.isActive;
  }
  createToken() {
    return jwt.sign(JSON.stringify(this), JWTPayload.secratekey);
  }
  static verifyCookie(token) {
    return jwt.verify(token, JWTPayload.secratekey);
  }
  static isValidUser(req, resp) {
    const myToken = req.cookies["myToken"];
    if (!myToken) {
      resp.status(504).send("Login required");
      return false;
    }

    const newPayload = JWTPayload.verifyCookie(myToken);
    if (!newPayload.isActive) {
      resp.status(504).send("Admin Login Required");
      return false;
    }
    return true;
  }

  static isValidAdmin(req, resp) {
    // console.log(req.cookies["myToken"]);
    const myToken = req.cookies["myToken"];
    // console.log(myToken);
    if (!myToken) {
      resp.status(504).send("Login required");
      return false;
    }

    const newPayload = JWTPayload.verifyCookie(myToken);
    if (newPayload.role != "admin") {
      resp.status(504).send("Admin Login Required");
      return false;
    }
    return true;
  }
}
module.exports = { JWTPayload };
