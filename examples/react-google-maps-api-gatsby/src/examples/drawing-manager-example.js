import React from 'react'
import PropTypes from 'prop-types'
import {
  GoogleMapProvider,
  GoogleMap,
  DrawingManager
} from '../../../../src'

const center = {
  lat: 0,
  lng: -180
}

const DrawingManagerExamplePropTypes = {
  styles: PropTypes.shape({
    container: PropTypes.object.isRequired,
    mapContainer: PropTypes.string.isRequired
  }).isRequired
}

const DrawingManagerExample = ({ styles }) => (
  <div>
    <GoogleMapProvider
      id='drawing-manager-example'
      mapContainerStyle={styles.container}
      mapContainerClassName={styles.mapContainer}
    >
      <GoogleMap
        zoom={2}
        center={center}
      >
        <DrawingManager />
      </GoogleMap>
    </GoogleMapProvider>
  </div>
)

DrawingManagerExample.propTypes = DrawingManagerExamplePropTypes

export default DrawingManagerExample
