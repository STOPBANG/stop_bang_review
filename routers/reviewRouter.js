const express = require("express");
const router = express.Router();

//Controllers
const reviewController = require("../controllers/reviewController.js");

router.use((req, res, next) => {
  console.log("Router for review was started");
  next();
});

module.exports = router;
