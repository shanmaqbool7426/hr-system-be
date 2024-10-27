const io = require('socket.io')();
module.exports.socket = io
const User = require('../app/models/user')

io.on('connection', async (stream) => {
    const { user } = stream.handshake.query
    const employee = await User.findById(user)
    if (employee) {
        stream.join(employee._id)
        await User.updateOne({ _id: employee._id }, { $set: { online: true } })
        stream.emit(`company_${employee.company._id}`, {
            type: 'user_connected',
            data: {
                _id: employee._id,
                email: employee.email,
            }
        })
    }
    stream.on('disconnect', async () => {
        stream.leave(employee._id)
        await User.updateOne({ _id: employee._id }, { $set: { online: false } })
        stream.emit(`company_${employee.company._id}`, {
            type: 'user_disconnected',
            data: {
                _id: employee._id,
                email: employee.email,
            }
        })
    })
})