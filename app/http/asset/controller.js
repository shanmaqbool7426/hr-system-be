const { Response, BadRequest, serverError } = require('../../util/helpers')
const Asset = require("../../models/asset")
const AssetHistory = require("../../models/asset_history")
const CustomField = require("../../models/custom_field")
class AssetController {

    async list(req, res) {
        try {
            const { user } = req.payload
            const { deleted } = req.query
            let filter = { deletedAt: null, $or: [{ company: user.company._id }, { company: null }] }
            if (deleted) {
                filter.deletedAt = { $ne: null }
            }
            let list = await Asset.find(filter)
                .populate('assetType').populate('user').populate('deletedBy')

            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async details(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let asset = await Asset.findOne({ _id: id, deletedAt: null, $or: [{ company: user.company._id }, { company: null }] })
                .populate('assetType').populate('user')

            return Response(res, { asset })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async history(req, res) {
        try {

            const { user } = req.payload
            let list = await AssetHistory.find({ company: user.company._id })
                .populate('issueTo').populate('returnTo').populate('asset')

            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const data = req.body
            const { user } = req.payload
            const assetType = await CustomField.findById(data.assetType)

            const prefix = assetType.prefix
            let assetId = prefix + "-" + ("1".padStart(3, '0'))
            const exists = await Asset.findOne({ assetId: { $regex: prefix, $options: 'i' } }).sort({ assetId: -1 })
            if (exists) {
                const currentNumber = parseInt(exists.assetId.split('-')[1]) + 1
                assetId = prefix + "-" + (currentNumber.toString().padStart(3, '0'))
            }

            let insert = { company: user.company._id }
            insert.assetType = data.assetType
            insert.assetId = assetId
            insert.warrantyExpiry = data.warrantyExpiry
            insert.purchaseDate = data.purchaseDate
            insert.cost = data.cost
            insert.vendor = data.vendor
            insert.fields = data.fields
            let asset = await Asset.create(insert)
            asset = await Asset.findById(asset._id).populate('assetType').populate('user')
            return Response(res, { asset })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const data = req.body
            const { user } = req.payload

            let asset = await Asset.findOne({
                _id: id, deletedAt: null, company: user.company._id
            })
            if (!asset) {
                return BadRequest(res, 'notFound')
            }
            asset.assetType = data.assetType
            asset.warrantyExpiry = data.warrantyExpiry
            asset.purchaseDate = data.purchaseDate
            asset.cost = data.cost
            asset.vendor = data.vendor
            asset.fields = data.fields
            await asset.save()
            asset = await Asset.findById(asset._id).populate('assetType').populate('user')
            return Response(res, { asset })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await Asset.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'notFound')
            }
            await Asset.updateOne({
                _id: id, company: user.company._id
            }, { $set: { deletedAt: new Date, deletedBy: user._id } })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
    async restore(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await Asset.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'notFound')
            }
            await Asset.updateOne({
                _id: id, company: user.company._id
            }, { $set: { deletedAt: null, deletedBy: null } })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
    async assignAsset(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            const data = req.body
            let asset = await Asset.findOne({
                _id: id, company: user.company._id
            })
            if (!asset) {
                return BadRequest(res, 'notFound')
            }
            asset.user = data.assignTo
            asset.status = "assigned"
            await asset.save()
            await AssetHistory.create({
                asset: asset._id,
                issueDate: data.assignDate,
                issueTo: data.assignTo,
                issueRemarks: data.remarks,
                company: user.company._id
            })
            asset = await Asset.findById(asset._id).populate('assetType').populate('user')
            return Response(res, { asset })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async returnAsset(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            const data = req.body
            let asset = await Asset.findOne({
                _id: id, company: user.company._id
            })
            if (!asset) {
                return BadRequest(res, 'notFound')
            }

            let history = await AssetHistory.findOne({
                asset: asset._id, returnTo: { $exists: false }
            })
            if (history) {
                history.returnDate = data.returnDate
                history.returnTo = data.returnTo
                history.returnRemarks = data.remarks
                await history.save()
                asset.user = data.returnTo
                asset.status = "returned"
                await asset.save()
            }

            asset = await Asset.findById(asset._id).populate('assetType').populate('user')
            return Response(res, { asset })
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new AssetController