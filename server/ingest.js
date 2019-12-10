const { geocode } = require('./geocoder');
const { elastic } = require('./elastic');
const { elevate } = require('./elevate');
const uuidv4 = require('uuid/v4');

const INDEX_NAME = process.env.INDEX_NAME || 'content';

// sample data for testing with GET
const ingestGet = async (req, res) => {
  const data = {
    imgUrl:
      '"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Beijing_montage_2019.png/1024px-Beijing_montage_2019.png',
    coordinates: ['116.27963213522958', '39.857073723727865'],
    createdAt: 'tuesday',
    message: 'this is taken outside the forbidden palace'
  };

  // enrich
  const enriched = await processItem(data);

  // insert
  res.send('success');
};

/**
 * Ingest and enrich a set of items into the search cluster
 * @param {Object} req the request from Express
 * @param {Object} res the response to send back to Express upon ingest
 */
const ingest = async (req, res) => {
  console.log(req.body);
  const body = req.body;
  // elastic.indices.refresh() // if your index refresh time is high, or you want immediate searchability, refresh the index after an insert
  const results = await ingestItems(body);

  res.json({
    message: `Sucessfully inserted ${results.length} items`,
    result: results
  });
};

const ingestItems = async items => {
  let processed = [];
  // if we have received multiple items, iterate and process each one
  if (Array.isArray(items)) {
    processed = items.map(processItem);
  } else {
    processed = [processItem(items)];
  }
  const results = await Promise.all(processed);
  return results;
};

// Geocodes the item, adds enriched geo object and inserts it
const processItem = async item => {
  // elevation
  const elevation = await elevate(item);

  // geocode
  const {
    text,
    place_type,
    place_name,
    relevance,
    context,
    geometry,
    bbox
  } = await geocode(item);

  const enriched = {
    geo: {
      type: place_type[0],
      text,
      place_name,
      relevance,
      context,
      geometry,
      bbox,
      elevation
    },
    ...item
  };

  const result = await insertItem(enriched);
  return result;
};

// Insert the item into our elastic index
const insertItem = async item => {
  const uuid = uuidv4();
  try {
    await elastic.index({
      id: uuid,
      index: INDEX_NAME,
      body: item
    });
    return { id: uuid, item };
  } catch (error) {
    console.log('error inserting item', error);
    return { id: uuid, item, message: 'error' };
  }
};
module.exports = { ingest, ingestGet, processItem, ingestItems };
