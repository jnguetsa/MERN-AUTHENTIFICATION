const express = require("express");

router = express.Router();

const controller = require("../controller/appController.js");

router.get("/getAll", controller.getAll);
router.post("/sign", controller.sign);
router.post("/verifyEmail", controller.verifyEmail);

module.exports = router;
