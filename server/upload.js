const multer = require('multer');
const { readFile, processFiles } = require('../data/exifToJSON');
const { ingestItems } = require('./ingest');

const UPLOAD_DIRECTORY = 'public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIRECTORY),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const uploader = multer({ storage: storage }).array('files');

// const uploader = multer({ dest: 'public/' });

const upload = async (req, res) => {
  uploader(req, res, async err => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    // Extract location from the image exif tags
    const exif = await processFiles(UPLOAD_DIRECTORY, req.files);

    // Change this if running a production server, we hardcode the image URL to localhost:3001
    exif.map(file => {
      file.imgUrl = `http://localhost:3001/${file.filename}`;
    });
    console.log(exif);
    const ingestResults = await ingestItems(exif);
    console.log(ingestResults);
    return res.status(200).send(req.files);
  });
};

module.exports = { upload };
