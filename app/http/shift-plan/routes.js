const express = require("express");
const router = express.Router();
const validations = require("./validations");
const { verifyToken } = require("../../middlewares");
const controller = require("./controller");
  // /shift-plan
router.post("/create", [verifyToken], controller.create);
router.get("/list" , [verifyToken], controller.list);
router.delete("/delete/:id", [verifyToken], controller.delete);
router.put("/update/:id" ,  controller.update);

module.exports = router;