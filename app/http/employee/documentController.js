const { Response, BadRequest, serverError } = require('../../util/helpers')
const User = require("../../models/user")
const UserDocument = require("../../models/user_documents")

class DocumentController {

    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let insert = {
                documentType: data.documentType,
                attachment: data.attachment,
                documentPath: data.documentPath,
                uploadedDate: data.uploadedDate,
                user: data.user,
                company: user.company._id
            }
            const document = await UserDocument.create(insert)
            if (!!await User.exists({ _id: data.user, company: user.company._id, documents: { $exists: false } })) {
                await User.updateOne({ _id: data.user, company: user.company._id }, { $set: { documents: [] } })
            }
            await User.updateOne({ _id: data.user, company: user.company._id }, { $push: { documents: document._id } }, { new: true })
            return Response(res, {
                document
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload

            let document = await UserDocument.findOne({
                _id: id, company: user.company._id
            })
            if (!document) {
                return BadRequest(res, 'recordNotFound')
            }
            const data = req.body
            
            if (data?.documentType) document.documentType = data.documentType
            if (data?.attachment) document.attachment = data.attachment
            if (data?.documentPath) document.documentPath = data.documentPath
            if (data?.uploadedDate) document.uploadedDate = data.uploadedDate
            await document.save()

            return Response(res, {
                document
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await UserDocument.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'recordNotFound')
            }
            await UserDocument.deleteOne({
                _id: id, company: user.company._id
            })
            await User.updateOne({ _id: exists.user, company: user.company._id }, { $pull: { documents: exists._id } }, { new: true })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new DocumentController