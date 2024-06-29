const nodemailerService = require("nodemailer");
const config = require("../util/config")


const sendEmail = async (email, subject, html, attachments = null) => {
    const transporter = nodemailerService.createTransport({
        host: config.MAILER_HOST,
        port: config.MAILER_PORT,
        auth: {
            user: config.MAILER_USERNAME,
            pass: config.MAILER_SECRET,
        }
    });

    const mailOptions = {
        from: config.MAILER_SENDER,
        to: email,
        subject,
        html,
    };

    // Check if you have attachments and add them conditionally
    if (attachments && attachments.length > 0) {
        mailOptions.attachments = attachments.map(attachment => ({
            filename: attachment.filename,
            content: attachment.content,
        }));
    }

    await transporter.sendMail(mailOptions);
    return true
}
module.exports.sendEmail = sendEmail
module.exports.default = { sendEmail }