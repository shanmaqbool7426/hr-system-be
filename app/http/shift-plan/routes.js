const express = require("express");
const router = express.Router();
const validations = require("./validations");
const { verifyToken } = require("../../middlewares");
const controller = require("./controller");

router.post("/create", [verifyToken], controller.create);

module.exports = router;
