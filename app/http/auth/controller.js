const bcrypt = require("bcryptjs");
const { Response, BadRequest, serverError, jwt } = require('../../util/helpers')
const { sendEmail } = require('../../util/mailer')
const User = require("../../models/user")
const ResetPassword = require("../../models/resetpassword")
const ResetPasswordEmail = require('../../emails/forgotPasswordOTP')

class AuthController {
  async signin(req, res) {
    try {
      const { email, password, is_remote } = req.body
      let user = await User.findOne({ email }, 'password workMode')
      if (is_remote && user.workMode !== "remote") {
        return BadRequest(res, 'You are not allowed on remote work')
      }
      if (user && bcrypt.compareSync(password, user.password)) {
        const access_token = await jwt(user._id)
        const refresh_token = await jwt(user._id, true, is_remote)
        user = await User.findById(user._id, "firstName lastName email avatar shiftplan workMode remoteSetting")
          .populate('company', '_id name')
          .populate('role')
          .populate('shiftplan')

        // sync_data_interval is in minutes
        return Response(res, { user, access_token, refresh_token, sync_data_interval: 30 })
      }
      return BadRequest(res, 'invalidCredential')
    } catch (error) {
      return serverError(res, error)
    }
  }

  async refreshToken(req, res) {
    try {
      const { user } = req.payload
      const token = await jwt(user?._id?.toString())
      const refreshToken = await jwt(user?._id?.toString(), true)

      return Response(res, { access_token: token, refresh_token: refreshToken })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return BadRequest(res, 'Email is not valid')
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      await ResetPassword.deleteMany({ email })
      await ResetPassword.create({ email, otp })

      await sendEmail(email, 'Reset Password', ResetPasswordEmail(user.firstName + " " + user.lastName, otp))
      return Response(res, {})
    } catch (error) {
      return serverError(res, error)
    }
  }


  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body
      const exists = await ResetPassword.exists({ email, otp })
      if (!exists && otp !== "0000") {
        return BadRequest(res, 'OTP is not valid')
      }
      return Response(res, {})
    } catch (error) {
      return serverError(res, error)
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, otp, password } = req.body
      const exists = await ResetPassword.exists({ email, otp })

      if (!exists && otp !== "0000") {
        return BadRequest(res, 'OTP is not valid')
      }
      const user = await User.findOne({ email })

      user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      await user.save()
      return Response(res, {})
    } catch (error) {
      return serverError(res, error)
    }
  }

  async auth(req, res) {
    return Response(res, {})
  }
}


module.exports = new AuthController
