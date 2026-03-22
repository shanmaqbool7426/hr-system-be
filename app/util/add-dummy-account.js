const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { MONGO_DB_URI } = require("./config");

const User = require("../models/user");
const Company = require("../models/company");
const Role = require("../models/role");
const Department = require("../models/department");
const CustomField = require("../models/custom_field");

mongoose.connect(MONGO_DB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));

db.once("open", async function () {
  try {
    console.info("Database connected");

    // Get or create Company
    let company = await Company.findOne({ name: "Stratis HR" });
    if (!company) {
      company = await Company.create({ name: "Stratis HR" });
      console.info("Created company: Stratis HR");
    }

    // Get or create Admin role
    let adminRole = await Role.findOne({ name: "Admin" });
    if (!adminRole) {
      adminRole = await Role.create({ name: "Admin", rights: "admin" });
      console.info("Created Admin role");
    }

    // Get or create Department
    let department = await Department.findOne({ name: "General" });
    if (!department) {
      department = await Department.create({
        name: "General",
        code: "G-0001",
        status: "active",
      });
      console.info("Created General department");
    }

    // Get On Boarding status for user
    let status = await CustomField.findOne({ name: "On Boarding", type: "employee_status" });
    if (!status) {
      status = await CustomField.create({ name: "On Boarding", type: "employee_status" });
    }

    const dummyUser = {
      firstName: "Demo",
      lastName: "User",
      email: "demo@stratishub.com",
      password: bcrypt.hashSync("Admin@123", bcrypt.genSaltSync(10)),
      emailVerifiedAt: new Date(),
      company: company._id,
      role: adminRole._id,
      department: department._id,
      workMode: "onsite",
      status: status._id,
    };

    const existing = await User.findOne({ email: dummyUser.email });
    if (existing) {
      console.info("Dummy account already exists:");
      console.info("  Email: demo@luminahr.com");
      console.info("  Password: Admin@123");
    } else {
      await User.create(dummyUser);
      console.info("Dummy account created successfully!");
      console.info("  Email: demo@stratishub.com");
      console.info("  Password: Admin@123");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
});
