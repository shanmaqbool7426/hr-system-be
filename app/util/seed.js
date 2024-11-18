const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
var { MONGO_DB_URI } = require("./config")
mongoose.connect(MONGO_DB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.info("Database Connected successfully");
});



const truncateAllModels = new Promise(async (resolve, reject) => {
  try {
    const modelsDir = path.join(__dirname, '../models');
    const files = fs.readdirSync(modelsDir)
    for (let file of files) {
      const model = require(path.join(modelsDir, file));
      await model.deleteMany({});
    }
    resolve(true);
  } catch (error) {
    reject(error);
  }
});

const custom_fields = [
  { name: 'Male', type: 'gender' },
  { name: 'Female', type: 'gender' },
  { name: 'Other', type: 'gender' },
  { name: 'Mr', type: 'prefix' },
  { name: 'Miss', type: 'prefix' },
  { name: 'Mrs', type: 'prefix' },
  { name: 'CEO', type: 'designation' },
  { name: 'CTO', type: 'designation' },
  { name: 'On Boarding', type: 'employee_status' },
  { name: 'Probation', type: 'employee_status' },
  { name: 'Intership', type: 'employee_status' },
  { name: 'Contract', type: 'employee_status' },
  { name: 'Permanent', type: 'employee_status' },
  { name: 'Notice Period', type: 'employee_status' },
  { name: 'Inactive', type: 'employee_status' },
  { name: 'Single', type: 'marital_status' },
  { name: 'Married', type: 'marital_status' },
  { name: 'Widowed', type: 'marital_status' },
  { name: 'Divorced', type: 'marital_status' },
  { name: 'Separated', type: 'marital_status' },
  { name: 'Voluntary', type: 'resign_type' },
  { name: 'Involuntary', type: 'resign_type' },
  { name: 'Other', type: 'resign_type' },
  { name: 'On Site', type: 'work_mode' },
  { name: 'Hybrid', type: 'work_mode' },
  { name: 'Remote', type: 'work_mode' },
  { name: 'Pakistan', type: 'country' },
  { name: 'Lahore', type: 'city' },
  { name: 'DHA', type: 'area' },
  { name: 'DHA Lahore', type: 'station' },
  { name: 'Punjab', type: 'province' },
  { name: 'A', type: 'grade' },
  { name: 'B', type: 'grade' },
  { name: 'C', type: 'grade' },
]


// Import Models
const User = require("../models/user")
const Company = require("../models/company")
const Role = require("../models/role")
const Department = require("../models/department")
const CustomField = require("../models/custom_field")


// Seed
const Seed = async () => {
  const company = await Company.create({
    name: "Zaffre",
  })
  const role = await Role.create({
    name: "Admin",
    rights: "admin"
  })
  const role2 = await Role.create({
    name: "Employee",
    rights: {
      projects: { view: true },
      taskboards: { view: true },
      tasks: { view: true },
    }
  })
  const department = await Department.create({
    name: "General",
    code: "G-0001",
    status: 'active'
  })
  await User.create({
    firstName: 'Syed',
    lastName: 'Shujjat',
    email: 'shujaat@zaffretech.co',
    emailVerifiedAt: new Date,
    password: bcrypt.hashSync('Admin@123', bcrypt.genSaltSync(10)),
    company: company._id,
    role: role._id,
    workMode: 'onsite',
    department: department._id
  })
  await User.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    emailVerifiedAt: new Date,
    password: bcrypt.hashSync('Admin@123', bcrypt.genSaltSync(10)),
    company: company._id,
    role: role2._id,
    workMode: 'remote',
    department: department._id
  })
  for (let index in custom_fields) {
    await CustomField.create(custom_fields[index])
  }

  const onboarding = await CustomField.findOne({ name: "On Boarding" })
  await User.updateMany({}, { $set: { status: onboarding._id } })
  console.info("Database is seeded");
  process.exit()
}
truncateAllModels.then(() => Seed())
  .finally(() => {
    process.exit()
  })
