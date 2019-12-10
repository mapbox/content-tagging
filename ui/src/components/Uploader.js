import React from 'react';
import localSearch from '../api/localSearch';

/**
 * This component uploads JPG images to the `/upload` API which stores them on the server, then calls `ingest` to tag and index
 */
class Uploader extends React.Component {
  state = {
    files: [],
    loaded: 0,
    message: '',
    formStatus: ''
  };

  onInputChange = event => {
    // clear success or error messages
    this.setState({ formStatus: '' });
    console.log(event.target.files);
    this.setState({ files: event.target.files, loaded: 0 });
  };

  onInputClick = event => {
    // clear success or error messages
    this.setState({ formStatus: '' });
  };

  upload = async event => {
    let files = Array.from(this.state.files);
    if (!files.length) {
      return;
    }
    // start with one file
    const data = new FormData();
    console.log(files);
    files.map(file => {
      data.append('files', file);
      return file;
    });
    const resp = await localSearch.post('/upload', data);
    if (resp.status === 200) {
      this.setState({
        message: `Successfully uploaded ${resp.data.length} images`,
        formStatus: 'success'
      });
    } else {
      this.setState({
        message: `Something went wrong! ${resp.status}`,
        formStatus: 'error'
      });
    }
    console.log(resp);
  };

  render() {
    return (
      <div
        className={'ui form ' + this.state.formStatus}
        style={{ margin: '10px 0' }}
      >
        <div className="ui action input">
          <input
            multiple
            type="file"
            name="file"
            onChange={this.onInputChange}
            onClick={this.onInputClick}
          />
          <button className="ui primary button" onClick={this.upload}>
            Upload
          </button>
        </div>
        <div className="ui success message">{this.state.message}</div>
      </div>
    );
  }
}

export default Uploader;
