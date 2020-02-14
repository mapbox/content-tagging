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
      <div
        className="ui segment"
        style={{ width: '240px', margin: '1rem', padding: '0.5rem' }}
      >
        <div className="ui">
          <form className="ui form" onSubmit={this.onFormSubmit}>
            <div className="field">
              {/* <label htmlFor="imageSearch">Image Search: </label> */}
              <input
                type="text"
                id="imageSearch"
                placeholder="Search"
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
