const express = require("express");
const bodyParser = require("body-parser");
const user = require("./database");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const app = express();

app.set("view engine", "ejs");

passport.use(
  new LocalStrategy(function (username, password, done) {
    user.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: "User not found." });
      }

      if (!(user.password === password)) {
        return done(null, false, {
          message: "Invalid password.",
        });
      }

      return done(null, user);
    });
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/", session: false }),
  function (req, res) {
    var name = req.body.username;
    res.render("welcome", { User: "Welcome " + name });
  }
);

app.post("/signup", function (req, res) {
  var name = req.body.username;
  var pass = req.body.password;
  var cpass = req.body.cpassword;

  if (pass == cpass) {
    const data1 = new user({
      username: name,
      password: pass,
    });
    data1.save();
    res.redirect("/");
  } else {
    res.render("welcome", { User: "Password Mismatch" });
  }
});

mongoose
  .connect("mongodb://localhost:27017/login", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, function () {
      console.log("server has started on port 3000");
    });
  });
