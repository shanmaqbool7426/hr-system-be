const express = require("express");
const router = express.Router();
const validations = require("./validations");
const { verifyToken } = require("../../middlewares");
const controller = require("./controller");

router.get("/list", [verifyToken], controller.list);
router.post("/create", [verifyToken, validations.create], controller.create);
router.patch("/update/:id",[verifyToken, validations.create],controller.update);
router.delete("/delete/:id", [verifyToken], controller.delete);

module.exports = router;
