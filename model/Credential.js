const uuid = require("uuid");
class Credential {
  static allCredentials = [];
  constructor(userName, password) {
    this.username = userName;
    this.password = password;
    this.credentialId = uuid.v4();
  }

  static finduserName(userName) {
    for (let index = 0; index < Credential.allCredentials.length; index++) {
      if (Credential.allCredentials[index].usernameuserName == userName) {
        return [true, index];
      }
    }
    return [false, -1];
  }

  static createCredential(userName, password) {
    let [isuserNameExist, indexOfuserName] = Credential.finduserName(userName);
    if (isuserNameExist) {
      return [false, "userName Already Exist", null];
    }
    let newCredential = new Credential(userName, password);
    Credential.allCredentials.push(newCredential);
    return [true, "Credential Created", newCredential];
  }
}
module.exports = { Credential };
