const express = require("express");
const router = express.Router();
const User = require("../model/Users.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} =require("../middleware.js")

const userController= require("../controllers/users.js");

router.route("/signup")
.get( userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);
// Render signup form
// router.get("/signup", userController.renderSignupForm);

// Handle signup
// router.post(
//   "/signup",
//   wrapAsync(userController.signup)
// );

// // Render login form
// router.get("/login",userController.renderLoginForm);

// Handle login
// router.post(
//   "/login",saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

router.get("/logout",userController.logout)
module.exports = router;
