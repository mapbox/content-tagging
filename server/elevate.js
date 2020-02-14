const elevation = require('terrain-rgb-query');

// returns the elevation for an item using Mapbox Terrain RGB https://docs.mapbox.com/help/troubleshooting/access-elevation-data/
async function elevate(item) {
  const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  const template = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?pluginName=content-tagging&access_token=${token}`;
  const elevationQuery = new elevation.TerrainRGBquery(template);
  const el_result = await elevationQuery.queryElevation(item.coordinates);
  const el = el_result ? Number.parseFloat(el_result).toFixed(4) : 0.0;

  console.log(`Elevation: ${el}`);
  return el;
}
module.exports = { elevate };
