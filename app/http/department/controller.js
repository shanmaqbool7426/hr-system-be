const { Response, BadRequest, serverError } = require('../../util/helpers')
const Department = require("../../models/department")
class DepartmentController {

    async list(req, res) {
        try {
            let { perPage, page, sort, sortDir, filters } = req.query
            const { user } = req.payload
            if (!perPage) perPage = 10
            if (!page) page = 1
            let _filters = { $or: [{ company: user.company._id }, { company: null }] }
            if (filters) {
                filters = JSON.parse(filters)
                console.log('filters', filters, Object.keys(filters));
                if (Object.keys(filters).indexOf('search') !== -1 && filters.search.length > 0) {
                    _filters = {
                        ..._filters,
                        $or: [
                            { name: { $regex: filters.search, $options: 'i' } },
                            { code: { $regex: filters.search, $options: 'i' } },
                        ]
                    }
                }
                if (Object.keys(filters).indexOf('status') !== -1 && filters.status && filters.status !== 'all') {
                    _filters.status = filters.status
                }
            }
            let sorting = {}
            if (sort) sorting[sort] = sortDir === 'desc' ? -1 : 1
            else sorting._id = -1

            let data = await Department.find(_filters)
                .sort(sorting)
                .skip((page - 1) * perPage).limit(perPage)
                .populate('parent')
                .populate('head')
            let total = await Department.countDocuments(_filters)
            return Response(res, {
                list: data,
                total
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { name, code, head, parent } = req.body
            const { user } = req.payload
            let insert = { name, code, status: 'active', company: user.company._id }
            if (parent) insert.parent = parent
            if (head) insert.head = head
            let department = await Department.create(insert)
            department = await Department.findById(department._id)
                .populate('parent')
                .populate('head')
            return Response(res, { department })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { name, parent, head, code, status } = req.body
            const { user } = req.payload

            let department = await Department.findOne({
                _id: id, company: user.company._id
            })
            if (!department) {
                return BadRequest(res, 'departmentNotFound')
            }

            if (name) department.name = name
            if (parent) department.parent = parent
            if (head) department.head = head
            if (code) department.code = code
            if (status) department.status = status
            await department.save()
            department = await Department.findById(department._id)
                .populate('parent')
                .populate('head')
            return Response(res, {
                department
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await Department.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'departmentNotFound')
            }
            await Department.deleteOne({
                _id: id, company: user.company._id
            })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new DepartmentController