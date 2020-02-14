const { elastic } = require('./elastic');
const search = async (req, res) => {
  // change this to whatever we use
  const searchTerm = req.query.q;

  console.log('Search: ' + searchTerm);
  try {
    const result = await elastic.search({
      index: 'content',
      body: {
        query: {
          query_string: {
            query: searchTerm
          }
        }
      }
    });
    const hits = result.body.hits.hits;

    const response = hits.map(hit => {
      const source = hit._source;
      const obj = { id: hit._id, ...source };
      return obj;
    });

    res.json(response);
  } catch (err) {
    console.log(JSON.stringify(err));
    res.send(err);
  }
  // return nicely formatted results from ES
};

module.exports = { search };
