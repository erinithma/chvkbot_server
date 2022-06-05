require("dotenv").config();
const mysql = require("mysql2");

function auth(req, res, next) {
  const header = req.get("Authorization");
  if (!header || !/^Bearer\s/.test(header)) {
    res.sendStatus(401);
  }

  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
  });

  connection.query(
    "SELECT * FROM `tokens` INNER JOIN `admins` ON admins.id = tokens.user_id WHERE `token` = ?",
    [header.split(" ")[1]],
    function (err, results) {
      if (results.length && !err) {
        next();
      } else {
        res.sendStatus(401);
      }
    }
  );
}

module.exports = auth;
