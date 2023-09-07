const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //it extraxct the token from cookies
    const verifyUser = await jwt.verify(
      token,
      "mynameisvinodthapaiamyoutuberverygoodlyhello"
    );
    console.log(verifyUser);
    const user = await Register.findOne({ _id: verifyUser._id });
    console.log(user);
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports = auth;
