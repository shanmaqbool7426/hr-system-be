const express = require("express");
const router = express.Router();
const controller = require("./controller")
const validations = require("./validations")
const  { verifyToken } = require("../../middlewares")


// router.post("/create",[verifyToken, validations.create],controller.create)
router.post("/create",[validations.create],controller.create)
router.get("/getJobs",controller.getAll)


module.exports = router;