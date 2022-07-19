const uuid = require("uuid");
const { ContactDetail } = require("./ContactDetail.js");
class Contact {
  constructor(fname, lname) {
    this.contactId = uuid.v4();
    this.fname = fname;
    this.lname = lname;
    this.isActive = true;
    this.fullname = fname + " " + lname;
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
    if (this.isActive == false) {
      return "invalid Contact";
    }
    this.isActive = false;
    return true;
  }
  isContactExists(fullName) {
    if (this.isContactActive == false) return false;
    if (`${this.firstName} ${this.lastName}` == fullName) return true;
  }
  update(propertTobeUpdated, value) {
    if (this.isActive == false) {
      return [false, this, "invalid contact"];
    }
    console.log(propertTobeUpdated);
    switch (propertTobeUpdated) {
      case "firstname": {
        this.fname = value;
        this.UpdateFullname();
        return [true, this, "firstname updated successfully"];
      }
      case "lastname": {
        this.lname = value;
        this.UpdateFullname();
        return [true, this, "lastname updated successfully"];
      }
      default:
        return [false, this, "contact not updated "];
    }
  }

  UpdateFullname() {
    this.fullName = this.fname + " " + this.lname;
  }
}
module.exports = { Contact };
