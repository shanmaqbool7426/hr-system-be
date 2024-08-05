const express = require("express");
const router = express.Router();

const employeeController = require('./employeeController')
const academicsController = require('./academicsController')
const experienceController = require('./experienceController')
const changeRequestController = require('./changeRequestController')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list', [verifyToken], employeeController.list);
router.post('/create', [verifyToken, validations.create, validations.uniqueEmail], employeeController.create);
router.get('/details/:id', [verifyToken], employeeController.details);
router.patch('/update/:id', [verifyToken, validations.update], employeeController.update);
router.delete('/delete/:id', [verifyToken], employeeController.delete);

router.post('/academic-history/create', [verifyToken, validations.academics], academicsController.create);
router.patch('/academic-history/update/:id', [verifyToken, validations.academics], academicsController.update);
router.delete('/academic-history/delete/:id', [verifyToken], academicsController.delete);

router.post('/job-experience/create', [verifyToken, validations.experience], experienceController.create);
router.patch('/job-experience/update/:id', [verifyToken, validations.experience], experienceController.update);
router.delete('/job-experience/delete/:id', [verifyToken], experienceController.delete);

// Change Requests
router.get('/change-requests', [verifyToken], changeRequestController.list);
router.post('/change-requests/designation', [verifyToken, validations.changeDesignation], changeRequestController.designation);
router.post('/change-requests/department', [verifyToken, validations.changeDepartment], changeRequestController.department);
router.post('/change-requests/employee-code', [verifyToken, validations.changeEmployeeCode ], changeRequestController.employeeCode);
router.post('/change-requests/salary', [verifyToken, validations.changeSalary], changeRequestController.salary);
router.post('/change-requests/grade', [verifyToken, validations.changeGrade], changeRequestController.grade);
router.post('/change-requests/line-manager', [verifyToken, validations.changeLineManager ], changeRequestController.lineManager);

module.exports = router;
