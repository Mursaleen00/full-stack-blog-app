const express = require("express");
const cookieParser = require("cookie-parser");
const connectToDB = require("./config/db");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path");

const app = express();

dotenv.config();

const LoginRoute = require("./routes/login.routes");
const RegisterRoute = require("./routes/register.routes");
const HomeRoute = require("./routes/home.routes");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(flash());
app.use(cookieParser());

connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  const token = req.cookies.token;
  const pathName = req.path.split("/")[1];

  if (pathName === "auth") {
    if (token) return res.redirect("/");
  } else {
    if (!token) return res.redirect("/auth/login");
  }

  next();
});

app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);
app.use("/", HomeRoute);

app.listen(3000);
