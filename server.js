const express = require("express");
// const session = require('express-session');
const bodyParser = require("body-parser");
const user = require("./database");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const app = express();

// app.use(session({
//     secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
//   }));


passport.use(new LocalStrategy(
    // function of username, password, done(callback)
    function(username, password, done) {
      // look for the user data
      user.findOne({ username: username }, function (err, user) {
        // if there is an error
        if (err) { return done(err); }
        // if user doesn't exist
        if (!user) { return done(null, false, { message: 'User not found.' }); }
        // if the password isn't correct
        if (!(user.password === password)) { return done(null, false, {   
        message: 'Invalid password.' }); }
        // if the user is properly authenticated
        return done(null, user);
      });
    }
));

app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static("public"));



app.get("/", function(req, res){
        res.sendFile(__dirname + "/index.html")
})

app.get("/signup", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", passport.authenticate('local', { failureRedirect: '/', session: false }), function(req, res){

    var name = req.body.username;
    res.send("Welcome " + name);
})

app.post("/signup", function(req, res){
    var name = req.body.username;
    var pass = req.body.password;
    var cpass = req.body.cpasword;

    if(pass == cpass){
        const data1 = new user({
            username: name,
            password: pass
        })
        data1.save();
        res.redirect("/");
    } else {
        res.send("Passoword mismatch");
    }
    
})


mongoose.connect("mongodb://localhost:27017/login", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    app.listen(3000, function() {
        console.log("server has started on port 3000");
    });
    
});




