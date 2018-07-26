"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const bcrypt        = require("bcryptjs");
const cookieSession = require("cookie-session");

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");



// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

app.use(bodyParser.urlencoded({extended: true}));


// USES cookieSession
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// ******************************************************
// FUNCTIONS

function userAuthorization(userName, userPassword){
  const username = "joe";
  const password = "12345";
  if (username === userName && password === userPassword){
    return;
  } else {
    return false;
  }
};

// function encryptedString(nakedPassword) {
//   var tempStr = "qwe"
//   const encrpytedPassword = bcrypt.hashSync(tempStr, 10);
//   return encrpytedPassword;
// };

// function getsUserDBData (userName){
//   const knexReturn = knex('todo_users').where({username: userName}).select('password')
//   console.log(knexReturn);
//   return (encryptedDBPassword || false);
// };


// // ******************************************************
// CONSOLE LOG DEBUG TOOL
app.use((req, res, next) => {
  console.log("********** - CONSOLE LOG DEBUG TOOL - ***********");
  console.log("req.body.username:  " + req.body.username);
  console.log("req.body.password:  " + req.body.password);
  console.log("req.body.firstName: " + req.body.firstName);
  console.log("req.body.lastName:  " + req.body.lastName);
  console.log("req.body.email:     " + req.body.email);
  console.log("req.body.telephone: " + req.body.telephone);
  console.log("req.body.birthdate: " + req.body.birthdate);
  console.log("req.body.address:   " + req.body.address);
  console.log("#################  - END OF LIST  - #############");
  next();
});
// // ******************************************************



// Home page
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/personal", (req,res) => {
  const userName      = req.body.username;
  const userPassword  = req.body.password;

  if (userAuthorization(userName, userPassword)){
    res.redirect("/personal");
  } else {
    res.redirect("/");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const userObj = {
    username  : req.body.username,
    password  : req.body.password,
    first_name: req.body.firstName,
    last_name : req.body.lastName,
    address   : req.body.address,
    email     : req.body.email,
    mobile    : req.body.tel,
    dob       : req.body.birthdate, // check format output from page -- sent as HTML type 'date'
    gender    : req.body.gender,
  }

//  knexMakeNewUser(userObj);

  res.redirect("/personal");
});

app.get("/personal", (req, res) => {
// what we need from the DB:tasks
// key = serverVar : value = DBcolumn
  // const DBTemplateVars = {
  //   task_name
  //   user_id
  //   category_id
  //   url
  //   priority
  //   status
  //   created_at
  // }

  res.render("personal");
})

app.get("/tasks", (req, res) => {
  res.render("tasks");
});

app.get("/tasks/new", (req, res) => {
  res.render("newTask");
});

app.post("/tasks", (req, res) => {
  res.redirect("/tasks"); // redirect to tasks/:id eventually
});

app.get("/tasks/:id", (req, res) => {
  res.render("specifcTask");
});

app.get("/tasks/:id/edit", (req, res) => {
  res.render("editTask");
});

app.put("/tasks/:id", (req, res) => {
  res.redirect("/tasks/:id");
});

app.delete("/tasks/:id", (req, res) => {
  res.redirect("/tasks");
});

app.get("/profile/edit", (req, res) => {
  res.render("profileEdit");
});

app.put("/profile", (req, res) => {
  res.redirect("/tasks"); // TBD
});


// ******************************************************

app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
});
