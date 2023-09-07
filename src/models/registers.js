const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
employeeSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = await jwt.sign(
      { _id: this._id },
      "mynameisvinodthapaiamyoutuberverygoodlyhello"
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};
employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
  }
  next();
});
const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;
