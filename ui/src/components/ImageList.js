import React from 'react';
import './ImageList.css';
import ImageCard from './ImageCard';

/**
 * A tiled list of ImageCards
 * @param {*} props
 */
const ImageList = props => {
  if (Array.isArray(props.images)) {
    const images = props.images.map(image => {
      console.log(image);
      return <ImageCard image={image} key={image.filename} />;
    });
    return (
      <div className="image-list">
        {images}
        <div className="status ui bottom attached label">
          Found: {images.length} images
        </div>
      </div>
    );
  }
  return null;
};
export default ImageList;
