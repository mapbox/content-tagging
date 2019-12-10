import React from 'react';
import SearchBar from './SearchBar';
import ImageList from './ImageList';
import localSearch from '../api/localSearch';
import Uploader from './Uploader';

class App extends React.Component {
  state = { images: [] };
  onSearchSubmit = async term => {
    // send the search query to our local search API wrapper, which passes the query to Elasticsearch
    const resp = await localSearch.get('/search', {
      params: {
        q: term
      }
    });
    console.log(resp.data);
    this.setState({ images: resp.data });
    console.log('child submitted', term);
    //make an api call
  };
  render() {
    return (
      <div
        className="ui container"
        style={{ marginTop: '10px', marginBottom: '40px' }}
      >
        <SearchBar onSubmit={this.onSearchSubmit} />
        <ImageList images={this.state.images} />
        <Uploader />
      </div>
    );
  }
}

export default App;
