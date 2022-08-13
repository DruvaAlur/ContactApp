const { Contact } = require("./Contact.js");
const { Credential } = require("./Credential");

const uuid = require("uuid");
const { response } = require("express");
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
  static async createAdmin() {
    const userName = "druva123";
    const password = "druva";
    const fname = "Druva";
    const lname = "Alur";
    const role = "admin";

    // console.log(Credential.createCredential(userName, password));
    const [flag, message, newCredential] = Credential.createCredential(
      userName,
      password
    );
    if (!flag) {
      return message;
    }
    newCredential.password = await newCredential.getHashOfPassword();
    // console.log(newCredential.userName);
    const admin = new User(fname, lname, newCredential, role);
    User.allUsers.push(admin);
    console.log(User.allUsers.length);
    // console.log(User.allUsers);
    return [admin, "Admin created Successfully"];
  }
  async createUser(fname, lname, username, password, role) {
    if (this.isActive == false) return [null, "Not able to create an User"];
    if (this.role != "admin")
      return [null, "Please Specify the role to Admin to create a User"];
    let [indexOfUser, isUserActive, isUserExists] = User.isUserExists(username);
    if (isUserExists) {
      return [null, "username already exists"];
    }
    const newCredential = new Credential(username, password);
    newCredential.password = await newCredential.getHashOfPassword();
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
      this.isContactExists(fname + " " + lname);
    if (isContactExists) {
      return [null, false];
    }
    let newcontact = new Contact(fname, lname);
    console.log(this.contacts);
    this.contacts.push(newcontact);
    return [newcontact, true];
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
  deleteContact(fullname) {
    let [indexofcontact, isContactActive, isContactExists] =
      this.isContactExists(fullname);
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
  createContactDetail(fullname, type, value) {
    let [indexofcontact, isContactActive, isContactExists] =
      this.isContactExists(fullname);
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
    if (newContactDetail == false) {
      return false;
    }

    return newContactDetail;
  }
  static isUserExists(username) {
    console.log(username);
    console.log(User.allUsers);

    for (let i = 0; i < User.allUsers.length; i++) {
      console.log(username);
      console.log(User.allUsers[i].credential.username);
      if (username === User.allUsers[i].credential.username) {
        return [i, User.allUsers[i].isActive, true];
      }
    }
    return [null, false, false];
  }
  static isUserIdExists(userId) {
    for (let i = 0; i < User.allUsers.length; i++) {
      if (userId === User.allUsers[i].userId) {
        return [i, User.allUsers[i].isActive, true];
      }
    }
    return [null, false, false];
  }
  updateContact(fullname, propertTobeUpdated, value) {
    if (this.isActive == false) {
      return [false, null, "Invalid User"];
    }
    // console.log(fullName);
    // let arr = fullName.split(" ");
    // let fname = arr[0];
    // let lname = arr[1];
    const [indexOfContact, isContactActive, isContactExist] =
      this.isContactExists(fullname);
    if (!isContactExist) {
      return [false, null, "contact doesn't exist with that name"];
    }
    return this.contacts[indexOfContact].update(propertTobeUpdated, value);
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
  isContactExists(fullname) {
    for (let i = 0; i < this.contacts.length; i++) {
      if (fullname === this.contacts[i].fullname) {
        return [i, this.contacts[i].isActive, true];
      }
    }

    return [null, false, false];
  }

  // updateUserName(fname, lname) {
  //   this.username = this.fname + this.lname;
  // }
  updateUser(propertyToUpdate, value) {
    switch (propertyToUpdate) {
      case "firstname":
        this.fname = value;
        // this.updateUserName(value, this.lname);
        return true;

      case "lastname":
        this.lname = value;
        // this.updateUserName(this.fname, value);
        return true;
      case "username":
        this.credential.username = value;
        // this.updateUserName(this.fname, value);
        return true;

      default:
        return false;
    }
  }
}
module.exports = { User };
