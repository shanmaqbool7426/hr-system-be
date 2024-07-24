var express = require("express");
var router = express.Router();

router.use("/attendance", require("./http/attendance/routes"));
router.use("/assets", require("./http/asset/routes"));
router.use("/auth", require("./http/auth/routes"));
router.use("/biometric", require("./http/biometric/routes"));
router.use("/custom-fields", require("./http/custom-field/routes"));
router.use("/departments", require("./http/department/routes"));
router.use("/employees", require("./http/employee/routes"));
router.use("/files", require("./http/files/routes"));
router.use("/gazette-holidays", require("./http/gazetted-holiday/routes"));
router.use("/leaves", require("./http/leave/routes"));
router.use("/leave-requests", require("./http/leave-request/routes"));
router.use("/projects", require("./http/projects/routes"));
router.use("/roles", require("./http/role/routes"));
router.use("/shift-flag", require("./http/shift-flag/routes"));
router.use("/task-boards", require("./http/task-boards/routes"));
router.use("/tasks", require("./http/tasks/routes"));


router.use("/add-new-jobs",require("./http/add-new-jobs/routes"))

module.exports = router;
