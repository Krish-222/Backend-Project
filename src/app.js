require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 3000;
const path = require("path");
const Register = require("./models/registers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
require("./db/conn.js");
// const static_path = path.join(__dirname, "../public");
// // console.log(path.join(__dirname, "../public/index.html"));
// app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
// console.log(process.env.SECRET_KEY);
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secret", auth, (req, res) => {
  console.log(req.cookies.jwt);
  res.render("secret");
});
app.get("/logout", auth, async (req, res) => {
  try {
    console.log(req.user);
    res.clearCookie("jwt");
    console.log("Successfull");
    await req.user.save();
    res.render("/login");
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (password === confirmpassword) {
      const registerEmployee = new Register({
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });
      const generateToken = await registerEmployee.generateAuthToken();
      console.log(generateToken);
      const registered = await registerEmployee.save();
      res.cookie("jwt", generateToken, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });
      console.log(cookie);
      res.status(201).render("index");
    } else {
      res.send("PASSWORD NOT MATCHING");
    }
  } catch (error) {
    res.send(error);
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, useremail.password);
    const tokenh = await useremail.generateAuthToken();
    console.log("hello");
    console.log(tokenh);
    res.cookie("jwt", tokenh, {
      expires: new Date(Date.now() + 30000),
      httpOnly: true,
    });
    console.log(req.cookies.jwt);
    if (isMatch) {
      res.render("index");
    } else {
      res.send("INVALID LOGIN DETAILS");
    }
  } catch {
    res.status(400).send("INVALID LOGIN DETAILS");
  }
});
app.listen(port, () => {
  console.log(`connection is successful at the port no ${port}`);
});
