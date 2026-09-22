import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useTripStore } from '../../store/tripStore';
import L from 'leaflet';

// Fix for default Leaflet marker icon asset paths in Vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Advanced Viewport Adjuster Component (Fixes the blank tile screen glitch)
function MapViewUpdater({ points, defaultCenter }) {
  const map = useMap();

  useEffect(() => {
    if (points && points.length > 0) {
      // Create a dynamic bounding box encompassing all plotted route coordinates
      const bounds = L.latLngBounds(points);
      
      // Force map engine to dynamically calculate zoom scale to fit all points safely
      map.fitBounds(bounds, { 
        padding: [40, 40], 
        maxZoom: 14, 
        animate: true, 
        duration: 1.2 
      });
    } else if (defaultCenter) {
      // Fallback centering if no points are logged yet
      map.setView(defaultCenter, 13, { animate: true });
    }
  }, [points, defaultCenter, map]);

  return null;
}

export default function MapCanvas() {
  const { itinerary, currentDay } = useTripStore();

  const defaultCenter = [21.1458, 79.0882]; // Default view fallback
  const activeItems = itinerary.filter(item => item.day === currentDay);
  
  // Format coordinate pairs safely for Leaflet [[lat, lng], [lat, lng]]
  const pathCoordinates = activeItems.map(item => [item.lat, item.lng]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ width: '100%', height: '100%', background: '#0b0f19' }}
        zoomControl={false}
      >
        {/* Bulletproof, Ultra-Fast Dark Street Tile Provider URL String */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
          maxZoom={20}
          subdomains="abcd"
        />

        {/* Mount the fixed view layout calculation engine */}
        <MapViewUpdater points={pathCoordinates} defaultCenter={defaultCenter} />

        {/* Chronological Route Markers */}
        {activeItems.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.lat, item.lng]}
          />
        ))}

        {/* Dynamic Route Polyline Splines */}
        {pathCoordinates.length > 1 && (
          <Polyline 
            positions={pathCoordinates} 
            pathOptions={{ color: '#6366f1', weight: 4, opacity: 0.85 }} 
          />
        )}
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-indigo-400 font-mono z-[1000]">
        🟢 OPENSTREETMAP ENGINE LIVE (FREE)
      </div>
    </div>
  );
}