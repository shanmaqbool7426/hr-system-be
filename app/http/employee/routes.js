const express = require("express");
const router = express.Router();

const employeeController = require('./employeeController')
const academicsController = require('./academicsController')
const experienceController = require('./experienceController')
const documentController = require('./documentController')
const warningController = require('./warningController')
const changeRequestController = require('./changeRequestController')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list', [verifyToken], (req, res) => employeeController.list(req, res));
router.post('/create', [verifyToken, validations.create, validations.uniqueEmail], (req, res) => employeeController.create(req, res));
router.get('/details/:id', [verifyToken], (req, res) => employeeController.details(req, res));
router.patch('/update/:id', [verifyToken, validations.update], (req, res) => employeeController.update(req, res));
router.delete('/delete/:id', [verifyToken], (req, res) => employeeController.delete(req, res));

router.post('/academic-history/create', [verifyToken, validations.academics], (req, res) => academicsController.create(req, res));
router.patch('/academic-history/update/:id', [verifyToken, validations.academics], (req, res) => academicsController.update(req, res));
router.delete('/academic-history/delete/:id', [verifyToken], (req, res) => academicsController.delete(req, res));

router.post('/job-experience/create', [verifyToken, validations.experience], (req, res) => experienceController.create(req, res));
router.patch('/job-experience/update/:id', [verifyToken, validations.experience], (req, res) => experienceController.update(req, res));
router.delete('/job-experience/delete/:id', [verifyToken], (req, res) => experienceController.delete(req, res));

router.post('/document/create', [verifyToken, validations.documents], (req, res) => documentController.create(req, res));
router.patch('/document/update/:id', [verifyToken, validations.documents], (req, res) => documentController.update(req, res));
router.delete('/document/delete/:id', [verifyToken], (req, res) => documentController.delete(req, res));

router.post('/warning/create', [verifyToken, validations.warnings], (req, res) => warningController.create(req, res));
router.patch('/warning/update/:id', [verifyToken, validations.warnings], (req, res) => warningController.update(req, res));
router.delete('/warning/delete/:id', [verifyToken], (req, res) => warningController.delete(req, res));

// Change Requests
router.get('/change-requests', [verifyToken], (req, res) => changeRequestController.list(req, res));
router.post('/change-requests/designation', [verifyToken, validations.changeDesignation], (req, res) => changeRequestController.designation(req, res));
router.post('/change-requests/department', [verifyToken, validations.changeDepartment], (req, res) => changeRequestController.department(req, res));
router.post('/change-requests/employee-code', [verifyToken, validations.changeEmployeeCode ], (req, res) => changeRequestController.employeeCode(req, res));
router.post('/change-requests/salary', [verifyToken, validations.changeSalary], (req, res) => changeRequestController.salary(req, res));
router.post('/change-requests/grade', [verifyToken, validations.changeGrade], (req, res) => changeRequestController.grade(req, res));
router.post('/change-requests/line-manager', [verifyToken, validations.changeLineManager ], (req, res) => changeRequestController.lineManager(req, res));

module.exports = router;
