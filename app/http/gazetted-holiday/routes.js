const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middlewares");
const holidayController = require("./controller");

router.get("/list", [verifyToken], holidayController.list);
router.post("/create", [verifyToken], holidayController.create);
router.patch("/update/:id", [verifyToken], holidayController.update);
router.delete("/delete/:id", [verifyToken], holidayController.delete);

module.exports = router;
