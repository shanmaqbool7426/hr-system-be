const { Response, serverError, BadRequest } = require("../../util/helpers");
const AddNewJobs = require("../../models/add_new_jobs");

class NewJobsController {
    async create(req, res) {
        try {
            const { jobTitle, jobLocation, noOfVacancies, experience, age, salaryFrom, salaryTo, flagCount, jobType, status, description, department, startDate, expireDate } = req.body;

            if (!jobTitle || !jobLocation || !noOfVacancies || !experience || !age || !salaryFrom || !salaryTo || !flagCount || !jobType || !status) {
                return BadRequest(res, "All required fields must be provided.");
            }

            const newJob = new AddNewJobs({
                jobTitle, jobLocation, noOfVacancies, experience, age, salaryFrom, salaryTo, flagCount, jobType, status, description, department, startDate, expireDate
            });

            const job = await newJob.save();
            const populateJob = await AddNewJobs.findById(job._id);
            return Response(res, { job: populateJob });
        } catch (error) {
            return serverError(res, error);
        }
    }

    async getAll(req, res) {
        try {
            const jobs = await AddNewJobs.find();
            return Response(res, { jobs });
        } catch (error) {
            return serverError(res, error);
        }
    }
}

module.exports = new NewJobsController();
