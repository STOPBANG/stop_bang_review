const express = require("express");
const router = express.Router();

//Controllers
const reviewController = require("../controllers/reviewController.js");

router.use((req, res, next) => {
  console.log("Router for review was started");
  next();
});

router.post(
  '/:sys_ra_regno/create_process',
  reviewController.creatingReview);

router.get(
  '/update/:rv_id',
  reviewController.updateReview);

router.get(
  "/reportCheck/:rv_id",
  reviewController.reportCheck
)

router.get(
  "/avgRate/:ra_regno",
  reviewController.getAvgRate
)

module.exports = router;
