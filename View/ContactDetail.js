const uuid = require("uuid");
class ContactDetail {
  constructor(type, value) {
    this.contactDetailId = uuid.v4();
    this.type = type;
    this.value = value;
    this.isActive = true;
  }
}
module.exports = { ContactDetail };
