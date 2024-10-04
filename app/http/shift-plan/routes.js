const express = require("express");
const router = express.Router();
const validations = require("./validations");
const { verifyToken } = require("../../middlewares");
const controller = require("./controller");

router.get("/list", [verifyToken], (req, res) => controller.list(req, res));
router.post("/create", [verifyToken, validations.create], (req, res) => controller.create(req, res));
router.put("/update/:id", [verifyToken, validations.update], (req, res) => controller.update(req, res));
router.delete("/delete/:id", [verifyToken], (req, res) => controller.delete(req, res));
module.exports = router;