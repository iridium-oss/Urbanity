import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BAKU_CENTER = [40.4093, 49.8671];

export default function MapComponent({ lines = [], markers = [], dark = true, zoom = 12, className = '', height = '100%' }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 100);
    }
  }, []);

  const tileUrl = dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className={`${dark ? 'dark-map' : ''} ${className}`} style={{ height }} data-testid="map-container">
      <MapContainer
        center={BAKU_CENTER}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        zoomControl={true}
        ref={mapRef}
      >
        <TileLayer url={tileUrl} attribution='&copy; <a href="https://carto.com">CARTO</a>' />
        {lines.map((line) => (
          <Polyline
            key={line.id}
            positions={line.coords}
            pathOptions={{ color: line.color, weight: line.status === 'planned' ? 2 : 4, dashArray: line.status === 'planned' ? '8 8' : null, opacity: line.status === 'planned' ? 0.5 : 0.85 }}
          >
            <Popup>
              <div className="font-body text-sm">
                <strong>{line.name}</strong>
                <br />{line.stations} stations / {line.length_km} km
                <br />Every {line.frequency_min} min
              </div>
            </Popup>
          </Polyline>
        ))}
        {markers.map((m, i) => (
          <CircleMarker
            key={i}
            center={[m.lat, m.lng]}
            radius={m.radius || 6}
            pathOptions={{ color: m.color || '#3b82f6', fillColor: m.color || '#3b82f6', fillOpacity: 0.7, weight: 2 }}
          >
            {m.label && <Popup><span className="font-body text-sm">{m.label}</span></Popup>}
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
