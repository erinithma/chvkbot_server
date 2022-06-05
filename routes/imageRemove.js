require("dotenv").config();
var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
var auth = require("../auth/auth");

router.use("/image/remove", auth);

router.post("/image/remove", function (req, res, next) {
  fs.rm(path.join(__dirname, "../public/images/", req.body.name));
  res.send(
    JSON.stringify({
      status: "Ok",
    })
  );
});

module.exports = router;
