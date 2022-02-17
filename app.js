// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config/index")(app);
// require("./config/session.config")(app);

// default value for title local
const projectName = "GuruTrade";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();
// app.use((req, res, next) => {
//     if (req.session.user) {
//       User.findById(req.session.user._id).then((user) => {
//         req.app.locals.globalUser = user;
//         next();
//       });
//     } else {
//       next();
//     }
//   });

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

// Auth route
const authRouter = require("./routes/auth.routes");
app.use("/", authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);




module.exports = app;
