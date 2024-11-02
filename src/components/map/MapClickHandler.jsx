import { useMapEvents } from 'react-leaflet';

export default function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (typeof onMapClick === 'function') {
        onMapClick(e);
      }
    },
  });
  return null;
}