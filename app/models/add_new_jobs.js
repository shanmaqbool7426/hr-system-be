const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JobSchema = new Schema({    
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    noOfVacancies: {
        type: Number,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    salaryFrom: {
        type: Number,
        required: true
    },
    salaryTo: {
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ["Full Time", "Part Time"]
    },
    startDate: {
        type: Date
    },
    expireDate: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ["Open", "Closed"]
    },
    description: {
        type: String,
    },
    department: {
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model("add_new_jobs", JobSchema);
