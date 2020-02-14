import React from 'react';
import SearchBar from './SearchBar';
import ImageList from './ImageList';
import localSearch from '../api/localSearch';
import Uploader from './Uploader';
import Map from './Map';

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
  onHighlight = item => {
    console.log('Highlight', item);
    this.setState({
      activeItem: item
    });
  };
  render() {
    return (
      <div>
        <div className="mapWrapper">
          <Map
            images={this.state.images}
            onHighlight={this.onHighlight}
            active={this.state.activeItem}
          />
          <SearchBar onSubmit={this.onSearchSubmit} />
        </div>
        <div
          className="ui container"
          style={{
            marginBottom: '40px',
            overflowY: 'auto',
            position: 'relative',
            top: '230px'
          }}
        >
          <ImageList
            images={this.state.images}
            onHighlight={this.onHighlight}
            active={this.state.activeItem}
          />
          <Uploader />
        </div>
      </div>
    );
  }
}

export default App;
