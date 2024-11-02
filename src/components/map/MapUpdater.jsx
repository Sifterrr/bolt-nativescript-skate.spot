import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapUpdater({ viewport, onViewportChange }) {
  const map = useMap();

  useEffect(() => {
    map.setView([viewport.latitude, viewport.longitude], viewport.zoom);
  }, [map, viewport.latitude, viewport.longitude, viewport.zoom]);

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      onViewportChange({
        latitude: center.lat,
        longitude: center.lng,
        zoom: map.getZoom()
      });
    };

    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onViewportChange]);

  return null;
}