const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

function generateFilename() {
    const randomBytes = crypto.randomBytes(16);
    const hexString = randomBytes.reduce((acc, byte) => {
        return acc + byte.toString(16).padStart(2, '0');
    }, '');
    return hexString;
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const directory = path.resolve(__dirname, '..', '..', 'public', 'uploads');
        cb(null, directory);
    },
    filename: (req, file, cb) => {
        const originalname = file.originalname;
        const ext = path.extname(originalname);
        const filename = generateFilename() + ext;
        cb(null, filename);
    }
});

const uploader = multer({ storage });

module.exports = uploader;
