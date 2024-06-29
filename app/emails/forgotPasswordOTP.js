module.exports = (name, otp) => {
    return `
    <body>
    <div>Hi ${name}</div>
        <div>Here is your OTP</div>
        <div>${otp}</div>
    </body>
    `
}