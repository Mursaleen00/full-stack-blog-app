const express = require("express");
const RegisterModel = require("../models/register.model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken");
const router = express.Router();
const multer = require("multer");
const { profileStorage } = require("../storage/storage");
const upload = multer({ storage: profileStorage });

// Render the register page
router.get("/register", (_, res) => {
  res.render("auth/register");
});

// Handle registration form submission
router.post(
  "/register",
  upload.single("profilePicture"),
  [
    // Validation rules
    body("email").trim().isEmail().withMessage("Invalid email address"),
    body("password")
      .trim()
      .isString()
      .isStrongPassword()
      .withMessage("Password must be strong"),
    body("name").trim().isString().withMessage("Name must be a string"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const { email, password, name } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Pass validation errors to the view
      return res.render("auth/register", {
        errors: errors.array(),
        message: "Validation failed",
      });
    }

    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await RegisterModel.create({
        name,
        email,
        password: hashedPassword,
        profilePicture: req.file?.path,
      });

      req.flash(
        "success",
        "Registration successful! Please login to continue."
      );

      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
        },
        process.env.JWT_SECRET
      );

      res.cookie("token", token);
      res.redirect("/");
    } catch (error) {
      console.error("Registration error:", error);

      // Handle duplicate email error
      if (error.code === 11000) {
        req.flash("error", "Email already exists");
        return res.redirect("/auth/register");
      }

      // Handle other errors
      req.flash("error", "An error occurred during registration");
      res.redirect("/auth/register");
    }
  }
);

module.exports = router;
