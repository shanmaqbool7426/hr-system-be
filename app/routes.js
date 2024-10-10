var express = require("express");
var router = express.Router();
var swaggerUi = require("swagger-ui-express");
var swaggerOutput = require("./swagger-docs/swagger_output.json");

const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
};

//Health route
router.get("/health", (req, res, next) => {
  res.status(200).send("Ok");
});

//App routes
router.use("/attendance", require("./http/attendance/routes"));
router.use("/attendance-requests", require("./http/attendance-request/routes"));
router.use("/assets", require("./http/asset/routes"));
router.use("/auth", require("./http/auth/routes"));
router.use("/biometric", require("./http/biometric/routes"));
router.use("/custom-fields", require("./http/custom-field/routes"));
router.use("/departments", require("./http/department/routes"));
router.use("/employees", require("./http/employee/routes"));
router.use("/exemption-requests", require("./http/exemption-request/routes"));
router.use("/exemption-types", require("./http/exemption-type/routes"));
router.use("/feedback", require("./http/feedback/routes"));
router.use("/files", require("./http/files/routes"));
router.use("/gazette-holidays", require("./http/gazetted-holiday/routes"));
router.use("/leaves", require("./http/leave/routes"));
router.use("/leave-requests", require("./http/leave-request/routes"));
router.use("/projects", require("./http/projects/routes"));
router.use("/remote", require("./http/remote/routes"));
router.use("/remote-categories", require("./http/remote-category/routes"));
router.use("/remote-work-requests", require("./http/remote-work-request/routes"));
router.use("/remote-teams", require("./http/remote-team/routes"));
router.use("/roles", require("./http/role/routes"));
router.use("/shift-flag", require("./http/shift-flag/routes"));
router.use("/shift-plans", require("./http/shift-plan/routes"));
router.use("/tasks", require("./http/tasks/routes"));
router.use("/task-boards", require("./http/task-boards/routes"));
router.use("/task-raise-issue", require("./http/task-raise-issue/routes"));
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput, swaggerUiOptions));

module.exports = router;
