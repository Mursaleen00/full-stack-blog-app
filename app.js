const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const LoginRoute = require("./routes/login.routes");
const RegisterRoute = require("./routes/register.routes");

const session = require("express-session");
app.use(
  session({
    secret: "your-secret-key", // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

const flash = require("express-flash");
app.use(flash());

const connectToDB = require("./config/db");
connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);

app.listen(3000);
