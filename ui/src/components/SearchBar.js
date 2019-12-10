import React from 'react';

class SearchBar extends React.Component {
  state = { term: '' };

  onInputChange = e => {
    console.log(e.target.value);
  };

  onFormSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.term);
  };

  render() {
    return (
      <div className="ui segment two column stackable grid">
        <div className="ui ten wide column">
          <form className="ui form" onSubmit={this.onFormSubmit}>
            <div className="field">
              <label htmlFor="imageSearch">Image Search: </label>
              <input
                type="text"
                id="imageSearch"
                onChange={e => {
                  this.setState({ term: e.target.value });
                }}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SearchBar;
