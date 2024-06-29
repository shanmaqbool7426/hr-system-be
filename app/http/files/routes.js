const express = require("express");
const router = express.Router();
const { verifyToken } = require('../../middlewares')
const uploader = require('../../util/multer')
const multerMiddleware = uploader.fields([{ name: 'attachment', maxCount: 1 }])
const { Response } = require('../../util/helpers')

router.post('/upload', [verifyToken, multerMiddleware], function (req, res) {
    return Response(res, { url: req.files.attachment[0].filename })
});

module.exports = router;
