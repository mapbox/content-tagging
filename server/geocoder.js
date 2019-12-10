'use strict';
const MapboxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoder = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxTokens = require('@mapbox/mapbox-sdk/services/tokens');

const token = process.env.MAPBOX_ACCESS_TOKEN;

const client = MapboxClient({
  accessToken: token
});

const tokenService = mbxTokens(client);
const scopesReq = tokenService.getToken();
scopesReq.query = { pluginName: 'content-tagging' };
scopesReq.send().then(resp => console.log(resp));

const geocoderService = mbxGeocoder(client);

const geocode = async data => {
  var config = {
    query: [
      parseFloat(data.coordinates[0], 10),
      parseFloat(data.coordinates[1], 10)
    ],
    limit: 1,
    mode: 'mapbox.places-permanent'
  };

  // Documentation on the geocoder service: https://github.com/mapbox/mapbox-sdk-js/blob/master/docs/services.md#reversegeocode
  const geocoderReq = geocoderService.reverseGeocode(config);
  geocoderReq.query = { pluginName: 'content-tagging' };

  var response = await geocoderReq.send();
  if (response.statusCode == '200' && response.body.features) {
    const feature = response.body.features[0];
    console.log(feature);
    return feature;
  } else {
    throw 'Geocoding error';
  }
};

module.exports = { geocode };
