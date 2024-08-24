const express = require("express");

router = express.Router();

const controller = require("../controller/appController.js");

router.get("/getAll", controller.getAll);
router.post("/sign", controller.sign);
router.post("/verifyEmail", controller.verifyEmail);

router.post("/logout", controller.logout);
router.post("/login", controller.login);

module.exports = router;
