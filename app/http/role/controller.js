const { Response, BadRequest, serverError } = require('../../util/helpers')
const Role = require("../../models/role")
class RoleController {

    async list(req, res) {
        try {
            let { perPage, page, sort, sortDir, filters } = req.query
            const { user } = req.payload
            if (!perPage) perPage = 10
            if (!page) page = 1
            let _filters = { $or: [{ company: user.company._id }, { company: null }] }
            if (filters) {
                if (Object.keys(filters).indexOf('search') !== -1 && filters.search.length > 0) {
                    _filters.name = { $regex: filters.search, $options: 'i' }
                }
            }
            let sorting = {}
            if (sort) sorting[sort] = sortDir === 'desc' ? -1 : 1
            else sorting._id = -1

            let data = await Role.find(_filters)
                .sort(sorting)
                .skip((page - 1) * perPage).limit(perPage)
            let total = await Role.countDocuments(_filters)
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
            const { name, rights } = req.body
            const { user } = req.payload
            const role = await Role.create({
                name, rights, company: user.company._id
            })
            return Response(res, {
                role
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { name, rights } = req.body
            const { user } = req.payload

            let role = await Role.findOne({
                _id: id, company: user.company._id
            })
            if (!role) {
                return BadRequest(res, 'roleNotFound')
            }

            role.name = name
            role.rights = rights
            await role.save()
            return Response(res, {
                role
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await Role.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'roleNotFound')
            }
            await Role.deleteOne({
                _id: id, company: user.company._id
            })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new RoleController