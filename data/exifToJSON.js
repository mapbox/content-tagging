const { ExifImage } = require('exif');
const path = require('path');
const fs = require('fs');

async function readDirectory(dir) {
  const files = fs.readdirSync(dir);
  const exifData = await Promise.all(
    files
      .filter(file => file.endsWith('.jpg'))
      .map(file => {
        return readFile(dir, file);
      })
  );
  return exifData;
}

async function readFile(directory, filename) {
  return new Promise((resolve, reject) => {
    new ExifImage(
      { image: path.resolve(directory, filename) },
      (error, data) => {
        if (error) {
          reject(error);
        }
        resolve({
          filename,
          ...data
        });
      }
    );
  });
}

async function processFiles(directory, files) {
  const exifData = await Promise.all(
    files
      .map(file => file.originalname)
      .filter(file => file.endsWith('.jpg'))
      .map(file => {
        return readFile(directory, file);
      })
  );
  const output = exifData.map(datum => {
    const { filename, exif, gps } = datum;
    const { CreateDate } = exif;

    return {
      coordinates: exifGPSToLongitudeLatitude(gps),
      filename,
      createdAt: CreateDate,
      message: 'batch-uploaded data'
    };
  });

  return output;
}

function exifGPSToLongitudeLatitude(gps) {
  const { GPSLatitudeRef, GPSLatitude, GPSLongitudeRef, GPSLongitude } = gps;
  const longitude_orientation = GPSLongitudeRef === 'E' ? 1 : -1;
  const latitude_orientation = GPSLatitudeRef === 'N' ? 1 : -1;
  return [
    decimalDegrees(GPSLongitude) * longitude_orientation,
    decimalDegrees(GPSLatitude) * latitude_orientation
  ];
}

function decimalDegrees([degrees, minutes, seconds]) {
  return degrees + minutes / 60 + seconds / 3600;
}

module.exports = {
  readFile,
  processFiles,
  readDirectory,
  decimalDegrees,
  exifGPSToLongitudeLatitude
};

///
/// CLI
///

if (require.main === module) {
  const dir = path.resolve('../data/img');
  readDirectory(dir).then(data => {
    const output = data.map(datum => {
      const { filename, exif, gps } = datum;
      const { CreateDate } = exif;

      return {
        coordinates: exifGPSToLongitudeLatitude(gps),
        imgUrl: 'img/' + filename,
        createdAt: CreateDate,
        message: 'batch-uploaded data'
      };
    });
    fs.writeFileSync('image-descriptions.json', JSON.stringify(output));
  });
}
