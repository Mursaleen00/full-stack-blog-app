const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const RegisterModel = require("../models/register.model");

// Render the login page
router.get("/login", (req, res) => {
  const messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  res.render("auth/login", { messages });
});

router.post(
  "/login",
  [
    // Validation rules
    body("email").trim().isEmail().withMessage("Invalid email address"),
    body("password")
      .trim()
      .isString()
      .isStrongPassword()
      .withMessage("Password must be strong"),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("auth/login", {
        errors: errors.array(),
        message: "Validation failed",
      });
    }

    try {
      const user = await RegisterModel.findOne({ email });

      if (!user) {
        req.flash("error", "Email or password is incorrect");
        return res.redirect("/auth/login");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        req.flash("error", "Email or password is incorrect");
        return res.redirect("/auth/login");
      }

      req.flash("success", "Login successful!");
      res.redirect("/");
    } catch (error) {
      console.error("Login error:", error);
      req.flash("error", "An error occurred during login");
      res.redirect("/auth/login");
    }
  }
);

module.exports = router;
