"use strict";
const express = require("express");
const DB = require("./db");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const db = new DB("sqlitedb");
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

app.use(allowCrossDomain);

router.post("/register", function(req, res) {
  db.insert(
    [req.body.username, bcrypt.hashSync(req.body.password, 8)],
    function(err) {
      console.log(err);
      if (err) {
        return res
          .status(500)
          .send("There was a problem registering the user.");
      }
      db.selectByUsername(req.body.username, (err, user) => {
        if (err) {
          return res.status(500).send("There was a problem getting user");
        }
        res.status(200).send({ auth: true, user });
      });
    }
  );
});

router.post("/update/token", function(req, res) {
  db.selectByUsername(req.body.uid, (err, user) => {
    if (err) {
      return res.status(500).send("Error on the server.");
    }
    if (!user) {
      return res.status(404).send("No user found.");
    }

    db.updateToken([req.body.token, req.body.uid], function(err) {
      if (err) {
        return res.status(500).send("There was a problem update user token.");
      }
    });
    res.status(200).send({ success: true });
  });
});

router.post("/login", (req, res) => {
  db.selectByUsername(req.body.username, (err, user) => {
    if (err) {
      return res.status(500).send("Error on the server.");
    }
    if (!user) {
      return res.status(404).send({ auth: true, message: "No user found." });
    }
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false });
    }
    res.status(200).send({ auth: true, user: user });
  });
});

app.use(router);

let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
  console.log("Express server listening on port " + port);
});
