import React from 'react';
// import mapboxgl from 'mapbox-gl';
// we are using a dev build so we can set feature id's from a string property
import mapboxgl from '../lib/mapbox-gl';
import './Map.css';
import bbox from '@turf/bbox';
import { featureCollection, feature } from '@turf/helpers';

const transformRequest = (url, resourceType) => {
  const isMapboxRequest =
    url.slice(8, 22) === "api.mapbox.com" ||
    url.slice(10, 26) === "tiles.mapbox.com";
  return {
    url: isMapboxRequest
      ? url.replace("?", "?pluginName=content-tagging&")
      : url
  };
};

class Map extends React.Component {
  state = { images: [], geoJSON: {} };
  componentDidMount() {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    this.theMap = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      hash: true,
      transformRequest: transformRequest
    });

    this.theMap.on('load', () => {
      this.theMap.addSource('content', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        promoteId: 'filename'
        // cluster: true
      });

      this.theMap.addLayer({
        id: 'content',
        type: 'circle',
        source: 'content',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'active'], false],
            '#306BF6',
            '#292C2F'
          ]
        }
      });

      this.theMap.on('mouseenter', 'content', e => {
        // Change the cursor style as a UI indicator.
        this.theMap.getCanvas().style.cursor = 'pointer';
        this.highlight(e);
      });

      this.theMap.on('mouseleave', 'content', e => {
        this.resetHighlight();
      });
      // on mobile it's tap driven not hover
      this.theMap.on('touchend', 'content', e => {
        this.resetHighlight();
        this.highlight(e);
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.images !== this.props.images) {
      this.updateSymbols(this.props.images);
      // this.createMarkers(this.props.images);
    }
    if (prevProps.active !== this.props.active) {
      this.resetHighlight();
      this.highlight(this.props.active);
    }
  }

  // Takes in an event or an id
  highlight = e => {
    if (e) {
      const id = e.features ? e.features[0].id : e;
      this.theMap.setFeatureState({ source: 'content', id }, { active: true });
      this.highlightedFeature = id;
      // We are using filename as a unique id for all hover behavior here
      this.props.onHighlight(id);
    }
  };

  resetHighlight = () => {
    if (this.highlightedFeature) {
      this.theMap.setFeatureState(
        { source: 'content', id: this.highlightedFeature },
        { active: false }
      );
    }
    this.theMap.getCanvas().style.cursor = '';
    this.props.onHighlight('');
  };

  updateSymbols = images => {
    let fc;
    if (images.length) {
      const features = this.props.images.map(image => {
        return feature(image.geo.geometry, image);
      });
      fc = featureCollection(features);
      const bb = bbox(featureCollection(features));
      this.theMap.fitBounds(bb, { padding: 50, maxZoom: 10 });
    } else {
      // If there are no results then clear the map
      fc = {
        type: 'FeatureCollection',
        features: []
      };
    }

    // this.setState({ geoJSON: fc });
    // console.log(fc);
    this.theMap.getSource('content').setData(fc);
  };

  // To use html markers instead of a GeoJSON source (slower)
  createMarkers = images => {
    //markers
    console.log('making markers', images);
    this.clearMarkers();
    let coordinates = [];
    this.markers = images.map(image => {
      coordinates.push(image.coordinates);
      return new mapboxgl.Marker()
        .setLngLat(image.coordinates)
        .addTo(this.theMap);
    });
    if (coordinates.length) {
      // This breaks with only one marker
      // this.contentBounds = new mapboxgl.LngLatBounds(coordinates);
      // this.theMap.fitBounds(this.contentBounds, { padding: 75 });
    }
  };

  clearMarkers = markers => {
    if (this.markers) {
      this.markers.forEach(marker => {
        marker.remove();
      });
    }
    // clear them
  };

  render() {
    return (
      <div
        className="mapContainer"
        ref={el => {
          this.mapContainer = el;
        }}
      ></div>
    );
  }
}

export default Map;
