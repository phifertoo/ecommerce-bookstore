const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // any space at the beginning or end will be trimmed out
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      // any space at the beginning or end will be trimmed out
      trim: true,
      required: true,
      unique: 32,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      // any space at the beginning or end will be trimmed out
      trim: true,
      maxlength: 32,
    },
    salt: String,
    role: {
      //0 is a standard user and 1 will be admin
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  // include timestamps
  { timestamps: true }
);

//virtual field

userSchema
  .virtual("password")
  .set(function (password) {
    // adding salt to the password
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  // plainText will be the password
  authenticate: function (plainText) {
    // whatever pasword is passed in will be compared against the hashed password.
    console.log(this.encryptPassword(plainText), this.hashed_password);
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

// makes a mongoose model called user based on the userSchema
module.exports = mongoose.model("User", userSchema);
