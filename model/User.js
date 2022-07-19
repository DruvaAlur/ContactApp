const { Contact } = require("./Contact.js");
const { Credential } = require("./Credential");
const uuid = require("uuid");
class User {
  static allUsers = [];
  constructor(fname, lname, credential, role) {
    this.userId = uuid.v4();
    this.fname = fname;
    this.lname = lname;
    this.role = role;
    this.isActive = true;
    this.credential = credential;
    this.contacts = [];
  }
  static createAdmin() {
    const userName = "druva123";
    const password = "druva@123";
    const fname = "Druva";
    const lname = "Alur";
    const role = "admin";
    const [flag, message, newCredential] = Credential.createCredential(
      userName,
      password
    );
    if (!flag) {
      return message;
    }
    // console.log(newCredential.userName);
    const admin = new User(fname, lname, newCredential, role);
    User.allUsers.push(admin);
    return [admin, "Admin created Successfully"];
  }
  createUser(fname, lname, username, password, role) {
    if (this.isActive == false) return [null, "Not able to create an User"];
    if (this.role != "admin")
      return [null, "Please Specify the role to Admin to create a User"];
    let [indexOfUser, isUserActive, isUserExists] = User.isUserExists(username);
    if (isUserExists) {
      return [null, "username already exists"];
    }
    const newCredential = new Credential(username, password);
    const newUser = new User(fname, lname, newCredential, role);
    User.allUsers.push(newUser);
    return [newUser, "New User created"];
  }

  createContact(fname, lname) {
    let [indexOfUser, isUserActive, isUserExists] = User.isUserExists(
      this.credential.username
    );
    if (!isUserActive || !isUserExists) {
      return "invalid user";
    }
    let [indexOfContact, isContactActive, isContactExists] =
      this.isContactExists(fname, lname);
    if (isContactExists) {
      return "contact already exists please choose other name";
    }
    let newcontact = new Contact(fname, lname);

    this.contacts.push(newcontact);
    return newcontact;
  }

  displayContact() {
    let tempcontacts = [];
    for (let i = 0; i < this.contacts.length; i++)
      if (this.contacts[i].isActive) tempcontacts.push(this.contacts[i]);

    return tempcontacts;
  }
  static displayUsers() {
    let tempusers = [];
    for (let i = 0; i < User.allUsers.length; i++)
      if (User.allUsers[i].isActive) tempusers.push(User.allUsers[i]);
    return tempusers;
  }
  deleteContact(contactfname, contactlname) {
    let [indexofcontact, isContactActive, isContactExists] =
      this.isContactExists(contactfname, contactlname);
    if (!isContactExists) {
      return "contact does not exists";
    }
    if (!isContactActive) {
      return "contact is not active";
    }
    let isContactDeleted = this.contacts[indexofcontact].deleteContact();
    if (isContactDeleted) {
      return "contact deleted";
    }
  }
  createContactDetail(fname, lname, type, value) {
    let [indexofcontact, isContactActive, isContactExists] =
      this.isContactExists(fname, lname);
    if (!isContactExists) {
      console.log("Contact doesnt exists");
      return;
    }
    if (!isContactActive) {
      console.log("contact is not active");
      return;
    }
    let newContactDetail = this.contacts[indexofcontact].createContactDetail(
      type,
      value
    );

    return newContactDetail;
  }
  static isUserExists(username) {
    for (let i = 0; i < User.allUsers.length; i++) {
      if (username === User.allUsers[i].credential.username) {
        return [i, User.allUsers[i].isActive, true];
      }
    }
    return [null, false, false];
  }

  deleteUser(username) {
    console.log(username);
    if (this.role == "admin") {
      let [indexofUser, isUserActive, isUserExists] =
        User.isUserExists(username);
      console.log(indexofUser);
      //   if (!isUserExists) {
      //     console.log("User doesnt exists");
      //     return;
      //   }
      //   if (!isUserActive) {
      //     console.log("User is not active");
      //     return;
      //   }
      User.allUsers[indexofUser].isActive = false;
    }
    return "only admin can delete users";
  }
  isContactExists(fname, lname) {
    for (let i = 0; i < this.contacts.length; i++) {
      if (
        fname === this.contacts[i].fname &&
        lname === this.contacts[i].lname
      ) {
        return [i, this.contacts[i].isActive, true];
      }
    }

    return [null, false, false];
  }
  updateFirstname(newFirstname) {
    this.fname = newFirstname;
  }
  updateLastName(newlastname) {
    this.lname = newlastname;
  }
  // updateUserName(fname, lname) {
  //   this.username = this.fname + this.lname;
  // }
  update(propertyToUpdate, value) {
    switch (propertyToUpdate) {
      case "firstName":
        this.updateFirstname(value);
        // this.updateUserName(value, this.lname);
        return true;

      case "lastName":
        this.updateLastName(value);
        // this.updateUserName(this.fname, value);
        return true;

      default:
        return false;
    }
  }
}
module.exports = { User };
