import React from 'react';
import { file } from '@babel/types';

/**
 * This component renders an image with its metadata with a cascading tiled layout
 */
class ImageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { spans: 0 };
    this.imageRef = React.createRef();
  }

  defaultProps = {
    active: false
  };
  setSpans = event => {
    const height = this.imageRef.current.clientHeight;
    const spans = Math.ceil(height / 10);
    this.setState({ spans });
  };
  componentDidMount() {
    // clientHeight will be zero until image has loaded
    this.imageRef.current.addEventListener('load', this.setSpans);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.active) {
        this.ref.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
  render() {
    console.log(this.props.image);
    const { imgUrl, geo, message, id, createdAt, filename } = this.props.image;
    return (
      <a
        id={filename}
        className={`ui card ${
          this.props.active === true ? 'raised active' : ''
        }`}
        onMouseOver={() => {
          console.log('over');
          this.props.onHighlight(filename);
        }}
        onMouseOut={() => {
          console.log('mouse out');
          this.props.onHighlight('');
        }}
        href={imgUrl}
        ref={e => {
          this.ref = e;
        }}
        style={{ gridRowEnd: `span ${this.state.spans + 12}` }}
      >
        <div className="image">
          {/* <div className="ui card" style={{gridRowEnd: `span ${this.state.spans}`}}> */}
          <img
            ref={this.imageRef}
            alt={message}
            src={imgUrl}
            id={id}
            title={geo.place_name}
          />
        </div>
        <div className="content">
          <span className="header">{filename}</span>
          <div className="meta">
            <span className="date">{createdAt}</span>
            <span className="elevation">
              {`Elev: ${Number.parseFloat(geo.elevation).toFixed(1)}m`}
            </span>
          </div>
          <div className="description">{geo.place_name}</div>
        </div>
      </a>
    );
  }
}

export default ImageCard;
