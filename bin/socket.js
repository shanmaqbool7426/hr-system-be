const io = require('socket.io')();

const User = require('../app/models/user')

io.on('connection', async (stream) => {
    const { user } = stream.handshake.query
    const employee = user ? await User.findById(user) : null
    if (employee) {

        await User.updateOne({ _id: employee._id }, { $set: { online: true } })
        io.emit(`company-${employee.company._id}`, {
            type: 'user_connected',
            data: {
                _id: employee._id,
                email: employee.email,
            }
        })
    }
    stream.on('disconnect', async () => {
        if (user) {
            await User.updateOne({ _id: user }, { $set: { online: false } })
            io.emit(`company-${employee.company._id}`, {
                type: 'user_disconnected',
                data: {
                    _id: employee._id,
                    email: employee.email,
                }
            })
        }
    })
})
module.exports.socket = io