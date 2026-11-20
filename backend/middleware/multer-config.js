const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '..', 'images')); // FIXME - Middle ware to handle - open the images on a disk
  },
  filename: (req, file, callback) => {
    const base = path.parse(file.originalname).name.split(' ').join('_');
    callback(null, `${base}${Date.now()}.${MIME_TYPES[file.mimetype]}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) return callback(null, true);
  return callback(new Error('Unsupported image type'));
};

module.exports = multer({ storage, fileFilter }).single('image');
