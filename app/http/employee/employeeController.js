const { Response, BadRequest, serverError } = require("../../util/helpers");
const User = require("../../models/user");
const Company = require("../../models/company");
const Asset = require("../../models/asset");
const Project = require("../../models/project");
const UserDocument = require("../../models/user_documents");
const UserWarning = require("../../models/user_warning");
const bcrypt = require("bcryptjs");
const Mailer = require("../../util/mailer");
const UserCredentialsEmail = require("../../emails/userCredentials");
class EmployeeController {
  async list(req, res) {
    try {
      let { filters } = req.query;
      const { user } = req.payload;
      let _filters = { company: user.company._id };
      if (filters) {
        filters = JSON.parse(filters);
        for (let key in filters) {
          if (key !== "search" && filters[key] && filters[key] !== "all") {
            _filters[key] = filters[key];
          }
        }
        if (Object.keys(filters).indexOf("search") !== -1 && filters.search.length > 0) {
          _filters.$or = [
            { firstName: { $regex: filters.search, $options: "i" } },
            { lastName: { $regex: filters.search, $options: "i" } },
          ];
        }
      }
      let data = await User.find(_filters)
        .populate("department")
        .populate("designation")
        .populate("status")
        .populate("workMode")
        .populate("grade")
        .populate("station")
        .populate("lineManager")
        .populate("maritalStatus")
        .populate("gender")
        .populate("shiftplan");

      return Response(res, { list: data });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async details(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;
      let employee = await User.findOne({
        _id: id,
        company: user.company._id,
      })
        .select("-password -devices")
        .populate("department")
        .populate("academicsHistory")
        // .populate('documents')
        .populate("jobExperiences")
        .populate("designation")
        .populate("status")
        .populate("workMode")
        .populate("grade")
        .populate("station")
        .populate("gender")
        .populate("maritalStatus")
        .populate("lineManager")
        .populate("shiftPlan");

      let projects = await Project.find({
        $or: [{ leads: id }, { members: id }],
        company: user.company._id,
      })
        .populate("boards")
        .populate("createdBy", "_id firstName lastName avatar email")
        .populate("leads", "_id firstName lastName avatar email")
        .populate("members", "_id firstName lastName avatar email");

      let warnings = await UserWarning.find({
        user: id,
        company: user.company._id,
      }).populate("createdBy", "_id firstName lastName avatar email");

      let documents = await UserDocument.find({
        user: id,
        company: user.company._id,
      }).populate("documentType");
      console.log("documents", documents);

      let assets = await Asset.find({
        user: id,
        company: user.company._id,
      })
        .populate("assetType")
        .populate("user");

      employee = employee.toObject();
      employee.projects = projects;
      employee.warnings = warnings;
      employee.assets = assets;
      employee.documents = documents;

      return Response(res, {
        employee,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async create(req, res) {
    try {
      const { user } = req.payload;
      const data = req.body;
      let insert = {
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        contact: data.contact,
        employeeCode: data.employeeCode,
        designation: data.designation,
        joiningDate: data.joiningDate,
        status: data.status,
        employeeCode: user.company.currentEmployeeCode,
        company: user.company._id,
        shiftPlan: data.shiftPlan,
      };

      insert.mobileAttendance = !!data?.mobileAttendance;
      insert.webAttendance = !!data?.webAttendance;
      if (data?.password) insert.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
      if (data?.department) insert.department = data.department;
      if (data?.confirmationDate) insert.confirmationDate = data.confirmationDate;
      if (data?.resignDate) insert.resignDate = data.resignDate;
      if (data?.lastWorkingDate) insert.lastWorkingDate = data.lastWorkingDate;
      if (data?.lineManager && data?.lineManager !== "none") insert.lineManager = data.lineManager; 
      if (data?.avatar) insert.avatar = data.avatar;
      if (data?.role) insert.role = data.role;
      if (data?.cnic) insert.cnic = data.cnic;
      if (data?.fatherCnic) insert.fatherCnic = data.fatherCnic;
      if (data?.canLogin) {
        insert.canLogin = data.canLogin;
        Mailer.sendEmail(
          data?.email,
          "Sign Credentials",
          UserCredentialsEmail(data?.firstName + " " + data?.lastName, data?.email, data?.password)
        );
      }

      let employee = await User.create(insert);
      await Company.updateOne(
        { _id: user.company._id },
        { $set: { currentEmployeeCode: (parseInt(user.company.currentEmployeeCode) + 1).toString() } }
      );
      employee = await User.findById(employee._id)
        .populate("department")
        .populate("designation")
        .populate("maritalStatus")
        .populate("gender")
        .populate("status")
        .populate("workMode")
        .populate("lineManager")
        .populate("grade")
        .populate("station")
        .populate("shiftplan");
      return Response(res, {
        employee,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;

      let employee = await User.findOne({
        _id: id,
        company: user.company._id,
      }).select("-password -devices");
      if (!employee) {
        return BadRequest(res, "employeeNotFound");
      }
      const data = req.body;

      if (data?.firstName) employee.firstName = data.firstName;
      if (data?.lastName) employee.lastName = data.lastName;
      if (data?.fatherName) employee.fatherName = data.fatherName;
      if (data?.email) employee.email = data.email;
      if (data?.dateOfBirth) employee.dateOfBirth = data.dateOfBirth;
      if (Object.keys(data).includes("mobileAttendance")) employee.mobileAttendance = !!data.mobileAttendance;
      if (Object.keys(data).includes("webAttendance")) employee.webAttendance = !!data.webAttendance;
      if (data?.department && data?.department !== "") employee.department = data.department;
      else if (data?.department === "") employee.department = null;
      if (data?.designation) employee.designation = data.designation;
      if (data?.lineManager && data?.lineManager !== "") employee.lineManager = data.lineManager;
      else if (data?.lineManager === "") employee.lineManager = null;
      if (data?.avatar) employee.avatar = data.avatar;
      if (data?.shiftPlan) employee.shiftPlan = data.shiftPlan;
      if (data?.role) employee.role = data.role;
      if (data?.status) employee.status = data.status;
      if (data?.cnic) employee.cnic = data.cnic;
      if (data?.fatherCnic) employee.fatherCnic = data.fatherCnic;
      if (data?.employeeCode) employee.employeeCode = data.employeeCode;
      if (data?.joiningDate) employee.joiningDate = data.joiningDate;
      if (data?.confirmationDate) employee.confirmationDate = data.confirmationDate;
      if (data?.resignDate) employee.resignDate = data.resignDate;
      if (data?.lastWorkingDate) employee.lastWorkingDate = data.lastWorkingDate;
      if (data?.contact) employee.contact = data.contact;
      if (data?.passportNumber) employee.passportNumber = data.passportNumber;
      if (data?.gender) employee.gender = data.gender;
      if (data?.maritalStatus) employee.maritalStatus = data.maritalStatus;
      if (data?.nationality) employee.nationality = data.nationality;
      if (data?.religion) employee.religion = data.religion;
      if (data?.emergencyContact) employee.emergencyContact = data.emergencyContact;
      if (data?.nextOfKin) employee.nextOfKin = data.nextOfKin;
      if (data?.reference1) employee.reference1 = data.reference1;
      if (data?.reference2) employee.reference2 = data.reference2;
      if (data?.bankDetails) employee.bankDetails = data.bankDetails;
      if (data?.cnicIssueDate) employee.cnicIssueDate = data.cnicIssueDate;
      if (data?.cnicExpiryDate) employee.cnicExpiryDate = data.cnicExpiryDate;
      if (data?.EOBI) employee.EOBI = data.EOBI;
      if (data?.SSA) employee.SSA = data.SSA;
      if (data?.grade) employee.grade = data.grade;
      if (data?.station) employee.station = data.station;
      if (data?.address) employee.address = data.address;

      await employee.save();

      employee = await User.findById(employee._id)
        .populate("department")
        .populate("maritalStatus")
        .populate("gender")
        .populate("grade")
        .populate("station")
        .populate("designation")
        .populate("status")
        .populate("workMode")
        .populate("lineManager")
        .populate("shiftplan");

      return Response(res, {
        employee,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;
      let exists = await User.findOne({
        _id: id,
        company: user.company._id,
      });
      if (!exists) {
        return BadRequest(res, "employeeNotFound");
      }
      await User.deleteOne({
        _id: id,
        company: user.company._id,
      });
      return Response(res);
    } catch (error) {
      return serverError(res, error);
    }
  }
}

module.exports = new EmployeeController();
