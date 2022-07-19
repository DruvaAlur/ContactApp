const uuid = require("uuid");
const { ContactDetail } = require("./ContactDetail.js");
class Contact {
  constructor(fname, lname) {
    this.contactId = uuid.v4();
    this.fname = fname;
    this.lname = lname;
    this.isActive = true;
    this.fullname = fname + lname;
    this.contactDetails = [];
  }
  findContactDetail(type) {
    for (let index = 0; index < this.contactDetails.length; index++) {
      if (this.contactDetails[index].type === type) {
        return [true, index];
      }
    }
    return [false, -1];
  }
  createContactDetail(type, value) {
    if (this.isActive === false) {
      return "invalid contact";
    }
    let [isContactDetailExists, indexOfContactDetail] =
      this.findContactDetail(type);
    if (isContactDetailExists) {
      return "type already exists";
    }
    let newContactDetail = new ContactDetail(type, value);
    // console.log(newContactDetail);
    this.contactDetails.push(newContactDetail);
    return newContactDetail;
  }
  deleteContact() {
    this.isActive = false;
    return true;
  }
  isContactExists(fullName) {
    if (this.isContactActive == false) return false;
    if (`${this.firstName} ${this.lastName}` == fullName) return true;
  }
}
module.exports = { Contact };
