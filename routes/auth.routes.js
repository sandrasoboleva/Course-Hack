const router = require("express").Router();
const User = require("../models/User.model");

const bcrypt = require('bcryptjs');
const saltRounds = 10;

//SignUp

// SignUp, add to database, and encrypt password
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "Please provide your username, email and password.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hashSync(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        password: hashedPassword,
      });
    })
    .then((createdUser) => {
      console.log("new user was created woo!!", createdUser);
      res.render("user/user-profile");
      // session
      console.log(req.session);
      req.session.user = createdUser;
      console.log(req.session.user);
      
    })
    .catch((err) => console.log("ERROR CREATING USER", err));
});