require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const md5 = require("md5");
const { v4 } = require("uuid");
/* GET home page. */
router.post("/auth", function (req, res, next) {
  // create the connection to database
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
  });

  connection.query(
    "SELECT * FROM `admins` WHERE `name` = ? AND `password` = ?",
    [req.body.name, md5(req.body.password)],
    function (err, results) {
      if (results.length) {
        const token = v4().replace(/-/g, "");

        connection.query(
          "INSERT INTO `tokens` (user_id, token) values(?, ?)",
          [results[0].id, token],
          function (err, results) {
            if (!err) {
              res.send({
                token,
              });
            } else {
              res.send(JSON.stringify(err));
            }
          }
        );
      } else {
        res.sendStatus(401);
      }
    }
  );
});

module.exports = router;
