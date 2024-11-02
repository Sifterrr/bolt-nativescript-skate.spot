import mapboxgl from 'mapbox-gl';

// Set access token globally for Mapbox GL
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhY2tibGl0eiIsImEiOiJjbHJwOWRtYXQwMGF2MnFsYzBwZzk5OHpzIn0.YxRr3UqY7HJzKxQFqpKXVg';

export const MAPBOX_CONFIG = {
  accessToken: mapboxgl.accessToken,
  styles: {
    default: {
      url: 'mapbox://styles/mapbox/streets-v12',
      name: 'Streets'
    },
    dark: {
      url: 'mapbox://styles/mapbox/dark-v11',
      name: 'Dark'
    },
    light: {
      url: 'mapbox://styles/mapbox/light-v11',
      name: 'Light'
    },
    satellite: {
      url: 'mapbox://styles/mapbox/satellite-streets-v12',
      name: 'Satellite'
    }
  },
  bounds: [
    [-124.848974, 24.396308], // Southwest coordinates
    [-66.934570, 49.384358]   // Northeast coordinates
  ],
  defaultCenter: [-98.5795, 39.8283],
  defaultZoom: 4,
  minZoom: 3,
  maxZoom: 18
};