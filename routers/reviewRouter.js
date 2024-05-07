const express = require("express");
const router = express.Router();

//Controllers
const reviewController = require("../controllers/reviewController.js");

router.use((req, res, next) => {
  console.log("Router for review was started");
  next();
});

router.get(
  "/reportCheck/:rv_id",
  reviewController.reportCheck
)

module.exports = router;