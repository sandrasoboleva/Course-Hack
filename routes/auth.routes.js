const router = require("express").Router();
const User = require("../models/User.model");
const axios = require("axios").default;

//middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/logged");

// bcrypt and salt password hash
const bcryptjs = require("bcryptjs");
const saltRounds = 10;



router.get("/auto-complete", (req, res) => {
  var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://yh-finance.p.rapidapi.com/auto-complete',
  params: {q: 'tesla', region: 'US'},
  headers: {
    'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
    'x-rapidapi-key': '529c635a30msh46475bb2372309ep1469b6jsn67aa7351db11'
  }
};

axios.request(options).then(function (response) {
  res.render("api/auto-complete", response.data)
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
});


//Watchlist api
router.get("/get-popular-watchlists", (req, res) => {
  var axios = require("axios").default;

  var options = {
    method: 'GET',
    url: 'https://yh-finance.p.rapidapi.com/market/get-popular-watchlists',
    headers: {
      'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
      'x-rapidapi-key': '529c635a30msh46475bb2372309ep1469b6jsn67aa7351db11'
    }
  };
  
  axios.request(options).then(function (response) {
    res.render("api/popular-watchlists", response.data.finance.result[0].portfolios)
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
});

// SignUp, add to database, and encrypt password
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "Provide your username, email, and password.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password must contain at least 4 characters, one number, and one uppercase letter.",
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
      console.log('New user account was succesfully created', createdUser);
      
      // session
      console.log(req.session);
      req.session.user = createdUser;
      console.log(req.session.user);
      res.redirect("/userAccount");
    })
    .catch((err) => {
      res.render("auth/signup", { errorMessage: "Username is taken." });
    });
});

// Login Route
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Enter your email and password to login.",
    });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Provide registered email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/userAccount");
      } else {
        res.render("auth/login", { errorMessage: "Password is incorrect." });
      }
    })
    .catch((error) => next(error));
});

// User Account
router.get("/userAccount", (req, res) => {
  res.render("user/user-account", { userInSession: req.session.currentUser });
});

// Update user's account
router.get("/userAccount/:id/edit", (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      console.log(user);
      res.render("user/edit-account", { userInSession: user });
    })
    .catch((error) => next(error));
});

router.post("/userAccount/:id/edit", (req, res) => {
  const updatedUser = req.body;
  const userId = req.params.id;
  User.findByIdAndUpdate(userId, updatedUser)
    .then(() => {
      res.redirect("/userAccount");
    })
    .catch((error) => next(error));
});

// Delete User's account
router.post("/userAccount/:id/delete", (req, res)=> {
  const updatedUser = req.body;
  const userId = req.params.id;
   User.findByIdAndDelete(userId, updatedUser)
  .then(() => {
    req.session.destroy((err) => {
      if (err) next(err);
      res.status(204).redirect("/auth/signup");
    });
  })
  .catch((error) => next(error));
});


// Logout User
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;