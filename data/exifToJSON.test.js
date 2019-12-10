const { exifGPSToLongitudeLatitude, decimalDegrees } = require('./exifToJSON');

describe('decimalDegrees', () => {
  it('uses degrees as-is', () => {
    const input = [60, 0, 0];
    const actual = decimalDegrees(input);
    const expected = 60;
    expect(actual).toEqual(expected);
  });
  it('converts minutes to decimal parts', () => {
    const input = [60, 30, 0];
    const actual = decimalDegrees(input);
    const expected = 60.5;
    expect(actual).toEqual(expected);
  });
  it('converts seconds to decimal parts', () => {
    const input = [12, 0, 30];
    const actual = decimalDegrees(input);
    const expected = 12.008333333333333;
    expect(actual).toEqual(expected);
  });
});

describe('exifGPSToLongitudeLatitude', () => {
  it('northern latitudes are positive', () => {
    const input = {
      GPSLatitudeRef: 'N',
      GPSLatitude: [57, 30, 0],
      GPSLongitudeRef: 'W',
      GPSLongitude: [6, 15, 0]
    };
    const expected = [-6.25, 57.5];
    const actual = exifGPSToLongitudeLatitude(input);
    expect(actual).toEqual(expected);
  });
  it('southern latitudes are negative', () => {
    const input = {
      GPSLatitudeRef: 'S',
      GPSLatitude: [57, 30, 0],
      GPSLongitudeRef: 'W',
      GPSLongitude: [6, 15, 0]
    };
    const expected = [-6.25, -57.5];
    const actual = exifGPSToLongitudeLatitude(input);
    expect(actual).toEqual(expected);
  });
  it('eastern longitudes are positive', () => {
    const input = {
      GPSLatitudeRef: 'N',
      GPSLatitude: [57, 30, 0],
      GPSLongitudeRef: 'E',
      GPSLongitude: [6, 15, 0]
    };
    const expected = [6.25, 57.5];
    const actual = exifGPSToLongitudeLatitude(input);
    expect(actual).toEqual(expected);
  });
  it('western longitudes are negative', () => {
    const input = {
      GPSLatitudeRef: 'N',
      GPSLatitude: [57, 30, 0],
      GPSLongitudeRef: 'W',
      GPSLongitude: [6, 15, 0]
    };
    const expected = [-6.25, 57.5];
    const actual = exifGPSToLongitudeLatitude(input);
    expect(actual).toEqual(expected);
  });
});
