const { Response, BadRequest, serverError } = require('../../util/helpers')
const Asset = require("../../models/asset")
const CustomField = require("../../models/custom_field")
const AssetHistory = require("../../models/asset_history")
const HelpdeskTicket = require("../../models/helpdesk_ticket")
const { USER_FIELDS } = require("../../util/config")
class AssetController {

    async dashboard(req, res) {
        try {
            const { user } = req.payload
            const counts = await Promise.all([
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: { $nin: ["sold", "expired", "deleted"] } }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: "assigned" }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: { $in: ["new", "returned"] } }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: "reported" }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, isRepaired: true }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: "expired" }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: "sold" }),
                Asset.countDocuments({ company: user.company._id, deletedAt: { $ne: null } }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: { $nin: ["sold", "expired", "deleted"] }, condition: 1 }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: { $nin: ["sold", "expired", "deleted"] }, condition: 2 }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: { $nin: ["sold", "expired", "deleted"] }, condition: 3 }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: { $nin: ["sold", "expired", "deleted"] }, condition: 4 }),
                Asset.countDocuments({ company: user.company._id, deletedAt: null, status: { $nin: ["sold", "expired", "deleted"] }, condition: 5 }),
            ]);

            const [total, issued, reserved, reported, repaired, expired, sold, deleted, poor, fair, good, excellent, best] = counts;

            let totalPurchase = await Asset.aggregate([
                { $match: { company: user.company._id, deletedAt: null } },
                { $group: { _id: null, total: { $sum: "$cost" } } }
            ])
            totalPurchase = totalPurchase?.length ? totalPurchase[0].total : 0

            let netWorth = await Asset.aggregate([
                { $match: { company: user.company._id, deletedAt: null, status: { $in: ["new", "returned", "reported", "assigned"] } } },
                { $group: { _id: null, total: { $sum: "$cost" } } }
            ])
            netWorth = netWorth?.length ? netWorth[0].total : 0

            let repairCost = await HelpdeskTicket.aggregate([
                { $match: { company: user.company._id, status: "closed", hardwareType: "support" } },
                { $group: { _id: null, total: { $sum: "$repairCost" } } }
            ])
            repairCost = repairCost?.length ? repairCost[0].total : 0

            let reservedAssets = await Asset.aggregate([
                { $match: { company: user.company._id, deletedAt: null, status: { $in: ["new", "returned", "assigned", "reported"] } } },
                {
                    $lookup: {
                        from: "custom_fields",
                        localField: "assetType",
                        foreignField: "_id",
                        as: "assetType"
                    }
                },
                { $unwind: "$assetType" },
                {
                    $group: {
                        _id: "$assetType.name",
                        count: { $sum: 1 },
                        reserveCount: { $sum: { $cond: [{ $in: ["$status", ["new", "returned"]] }, 1, 0] } },
                        reportedCount: { $sum: { $cond: [{ $in: ["$status", ["reported"]] }, 1, 0] } }
                    }
                },
                { $project: { _id: 0, assetType: "$_id", count: 1, reserveCount: 1, reportedCount: 1 } }
            ]);

            reservedAssets = reservedAssets.reduce((acc, curr) => {
                acc[curr.assetType] = { total: curr.count, reserved: curr.reserveCount, reported: curr.reportedCount };
                return acc;
            }, {});


            return Response(res, {
                countStats: { netWorth, repairCost, totalPurchase, total, issued, reserved, reported, repaired, expired, sold, deleted, poor, fair, good, excellent, best },
                reservedAssets
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async list(req, res) {
        try {
            const { user } = req.payload
            const { deleted } = req.query
            let filter = { deletedAt: null, $or: [{ company: user.company._id }, { company: null }] }
            if (deleted) {
                filter.deletedAt = { $ne: null }
            }
            let list = await Asset.find(filter)
                .populate('assetType').populate('user', USER_FIELDS).populate('deletedBy', USER_FIELDS)

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
                .populate('assetType').populate('user', USER_FIELDS).populate('deletedBy', USER_FIELDS)

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
            insert.condition = data.condition
            let asset = await Asset.create(insert)
            asset = await Asset.findById(asset._id).populate('assetType').populate('user', USER_FIELDS).populate('deletedBy', USER_FIELDS)
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
                return BadRequest(res)
            }
            asset.assetType = data.assetType
            asset.warrantyExpiry = data.warrantyExpiry
            asset.purchaseDate = data.purchaseDate
            asset.cost = data.cost
            asset.vendor = data.vendor
            asset.fields = data.fields
            asset.condition = data.condition
            await asset.save()
            asset = await Asset.findById(asset._id).populate('assetType').populate('user', USER_FIELDS).populate('deletedBy', USER_FIELDS)
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
                return BadRequest(res)
            }
            await Asset.updateOne({
                _id: id, company: user.company._id
            }, { $set: { deletedAt: new Date, deletedBy: user._id, status: "deleted" } })
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
                return BadRequest(res)
            }
            await Asset.updateOne({
                _id: id, company: user.company._id
            }, { $set: { deletedAt: null, deletedBy: null, status: "returned" } })
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
                return BadRequest(res)
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
                return BadRequest(res)
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
    async changeStatus(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            const data = req.body
            let asset = await Asset.findOne({
                _id: id, company: user.company._id
            })
            if (!asset) {
                return BadRequest(res)
            }
            asset.status = data.status
            asset.remarks = data.remarks
            await asset.save()
            asset = await Asset.findById(asset._id).populate('assetType').populate('user', USER_FIELDS).populate('deletedBy', USER_FIELDS)
            return Response(res, { asset })
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new AssetController