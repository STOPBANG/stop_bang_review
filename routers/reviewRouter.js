const express = require("express");
const router = express.Router();

//Controllers
const reviewController = require("../controllers/reviewController.js");

router.use((req, res, next) => {
  console.log("Router for review was started");
  next();
});

router.post(
  '/create/:sys_regno',
  reviewController.createReview);

router.post(
  '/create_process/:sys_regno',
  reviewController.creatingReview);

router.get(
  '/update/:rv_id',
  reviewController.updateReview);

router.post(
  '/update_process/:rv_id',
  reviewController.updatingReview);

router.get(
  "/reportCheck/:rv_id",
  reviewController.reportCheck
)

router.get(
  "/avgRate/:sys_regno",
  reviewController.getAvgRate
)

module.exports = router;
