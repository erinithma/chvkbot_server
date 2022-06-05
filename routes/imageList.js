require("dotenv").config();
var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
var auth = require("../auth/auth");

function getTime(name, p) {
  return new Promise((res, rej) => {
    fs.stat(p, (error, stats) => {
      if (error) {
        rej(error);
      } else {
        res({
          name,
          time: stats.atimeMs,
        });
      }
    });
  });
}

router.use("/image/list", auth);
/* GET users listing. */
router.post("/image/list", function (req, res, next) {
  var images = fs.readdirSync(path.join(__dirname, "../public/images/"));
  var pr = [];
  for (let image of images) {
    pr.push(getTime(image, path.join(__dirname, "../public/images/" + image)));
  }
  Promise.all(pr).then((r) => {
    r.sort((a, b) => b.time - a.time);
    res.send(
      JSON.stringify({
        images: r
          .slice(0, +req.body.perPage)
          .map((r) => `${process.env.IMAGE_URL}${r.name}`),
        pages: Math.ceil(r.length / +req.body.perPage),
      })
    );
  });
});

module.exports = router;
