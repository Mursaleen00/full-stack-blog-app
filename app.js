const express = require("express");
const cookieParser = require("cookie-parser");
const connectToDB = require("./config/db");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path");

const jwt = require("jsonwebtoken");

const app = express();

dotenv.config();

const HomeRoute = require("./routes/home.routes");
const LoginRoute = require("./routes/login.routes");
const WritersRoute = require("./routes/writers.routes");
const ProfileRoute = require("./routes/profile.routes");
const RegisterRoute = require("./routes/register.routes");
const BlogsRoute = require("./routes/blogs.routes");

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
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  const token = req.cookies.token;
  const pathName = req.path.split("/")[1];

  const isValidToken = token
    ? jwt.verify(token, process.env.JWT_SECRET)
    : undefined;

  // if (pathName === "auth") {
  //   if (isValidToken) return res.redirect("/");
  // } else {
  //   if (!isValidToken) return res.redirect("/auth/login");
  // }

  next();
});

app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);
app.use("/", HomeRoute);
app.use("/", ProfileRoute);
app.use("/", WritersRoute);
app.use("/", BlogsRoute);

app.listen(3000);
