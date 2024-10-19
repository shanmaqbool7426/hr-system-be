const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("helpdesk_ticket", new Schema({
    title: { type: String },
    description: { type: String },
    ticketId: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
    assignedTo: { type: mongoose.Types.ObjectId, ref: 'user' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));


module.exports.schema.pre('save', async function (next) {
    if (!this.isNew) {
        return next();
    }

    const prefix = 'TICKET-';
    const maxNumber = await this.constructor.findOne({ company: this.company }).sort('-ticketId').exec();
    const count = maxNumber ? parseInt(maxNumber.ticketId.split('-')[1]) : 0;
    this.ticketId = `${prefix}${(count + 1).toString().padStart(4, '0')}`;

    next();
});