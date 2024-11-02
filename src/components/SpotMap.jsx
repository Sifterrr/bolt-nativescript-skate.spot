import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon, Text, Fill, Stroke, Circle } from 'ol/style';
import { SKATEPARKS } from '../data/skateparks';
import { SKATESHOPS } from '../data/skateshops';
import { FAMOUS_SPOTS } from '../data/famousSpots';
import MapLayersControl from './map/MapLayersControl';

// Modern marker styles
const createMarkerStyle = (type, selected = false) => {
  const getColor = () => {
    switch (type) {
      case 'trick': return selected ? '#4F46E5' : '#6366F1';
      case 'event': return selected ? '#BE185D' : '#DB2777';
      case 'shop': return selected ? '#047857' : '#059669';
      case 'park': return selected ? '#B45309' : '#D97706';
      case 'spot': return selected ? '#4338CA' : '#4F46E5';
      default: return selected ? '#4B5563' : '#6B7280';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'trick': return '🛹';
      case 'event': return '📅';
      case 'shop': return '🏪';
      case 'park': return '🏟️';
      case 'spot': return '📍';
      default: return '📍';
    }
  };

  return new Style({
    image: new Circle({
      radius: selected ? 12 : 10,
      fill: new Fill({
        color: getColor()
      }),
      stroke: new Stroke({
        color: '#FFFFFF',
        width: 2
      })
    }),
    text: new Text({
      text: getLabel(),
      scale: 1.2,
      offsetY: -20,
      fill: new Fill({
        color: '#FFFFFF'
      }),
      stroke: new Stroke({
        color: getColor(),
        width: 2
      })
    })
  });
};

function SpotMap({
  viewport,
  onViewportChange,
  spots = [],
  onMarkerClick,
  selectedSpot,
  onMapClick,
  selectedLocation,
  homeSkatepark,
  isFullscreen,
  mapBounds
}) {
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const [showLayers, setShowLayers] = useState({
    tricks: true,
    events: true,
    shops: true,
    parks: true,
    spots: true
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM({
            url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: fromLonLat([viewport.longitude, viewport.latitude]),
        zoom: viewport.zoom,
        minZoom: mapBounds?.minZoom || 3,
        maxZoom: mapBounds?.maxZoom || 18,
        extent: mapBounds?.extent,
        constrainOnlyCenter: true
      }),
      controls: []
    });

    map.on('click', (e) => {
      const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
      
      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        const [lon, lat] = toLonLat(coordinates);
        onMarkerClick(feature.get('data'));
      } else {
        const [lon, lat] = toLonLat(e.coordinate);
        onMapClick({ latlng: { lat, lng: lon } });
      }
    });

    map.on('moveend', () => {
      const view = map.getView();
      const center = toLonLat(view.getCenter());
      onViewportChange({
        longitude: center[0],
        latitude: center[1],
        zoom: view.getZoom()
      });
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;
    const layers = map.getLayers();

    // Remove existing vector layers
    layers.getArray()
      .filter(layer => layer instanceof VectorLayer)
      .forEach(layer => map.removeLayer(layer));

    // Add markers for each category
    const addMarkers = (items, type, visible) => {
      if (!visible || !items?.length) return;

      const features = items.map(item => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([item.lng, item.lat])),
          data: { ...item, type }
        });
        feature.setStyle(createMarkerStyle(type, selectedSpot?.id === item.id));
        return feature;
      });

      const layer = new VectorLayer({
        source: new VectorSource({ features }),
        zIndex: type === 'selected' ? 100 : 1
      });
      map.addLayer(layer);
    };

    if (showLayers.parks) {
      addMarkers(SKATEPARKS, 'park', true);
    }
    if (showLayers.shops) {
      addMarkers(SKATESHOPS, 'shop', true);
    }
    if (showLayers.spots) {
      addMarkers(FAMOUS_SPOTS, 'spot', true);
    }
    if (showLayers.tricks) {
      addMarkers(spots.filter(spot => spot.type === 'trick'), 'trick', true);
    }
    if (showLayers.events) {
      addMarkers(spots.filter(spot => spot.type === 'event'), 'event', true);
    }

    if (selectedLocation) {
      addMarkers([selectedLocation], 'selected', true);
    }
  }, [spots, showLayers, selectedLocation, selectedSpot]);

  return (
    <div className={`relative ${isFullscreen ? 'w-screen h-screen' : 'w-full h-full'}`}>
      <div ref={mapRef} className="w-full h-full" />
      <MapLayersControl
        layers={showLayers}
        onToggleLayer={(key) => setShowLayers(prev => ({ ...prev, [key]: !prev[key] }))}
      />
    </div>
  );
}

export default SpotMap;