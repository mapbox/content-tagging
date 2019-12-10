const { Client } = require('@elastic/elasticsearch');
const ELASTIC_TOKEN = process.env.ELASTIC_TOKEN || '';
const ELASTIC_URL = process.env.ELASTIC_URL || 'http://localhost:9200'; // default to localhost unless specified

let config = {
  node: ELASTIC_URL
};
if (ELASTIC_TOKEN) {
  config.auth = {
    apiKey: ELASTIC_TOKEN
  };
}
const elastic = new Client(config);

module.exports = { elastic };
