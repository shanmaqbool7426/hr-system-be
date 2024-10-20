const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    ticketId: { type: String },
    title: { type: String },
    description: { type: String },
    type: { type: String, enum: ['hardware', 'software', 'support'], default: 'support' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    asset: { type: mongoose.Types.ObjectId, ref: 'asset' },
    attachment: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
    assignedTo: { type: mongoose.Types.ObjectId, ref: 'user' },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
});


TicketSchema.pre('save', async function (next) {
    if (!this.isNew) {
        return next();
    }
    switch (this.type) {
        case 'hardware':
            prefix = 'HW-';
            break;
        case 'software':
            prefix = 'SW-';
            break;
        default:
            prefix = 'SP-';
            break;
    }
    const maxNumber = await this.constructor.findOne({ company: this.company }).sort('-ticketId').exec();
    const count = maxNumber ? parseInt(maxNumber.ticketId.split('-')[1]) : 0;
    this.ticketId = `${prefix}${(count + 1).toString().padStart(4, '0')}`;

    next();
});

module.exports = mongoose.model("helpdesk_ticket", TicketSchema);