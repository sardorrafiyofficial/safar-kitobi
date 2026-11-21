import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'

// Haqiqiy xarita: OpenStreetMap. Markerlar divIcon — rasm fayllari kerak emas.
const belgi = (matn, klass = '') => L.divIcon({ className: '', html: `<div class="marker ${klass}">${matn}</div>`, iconSize: [34, 34], iconAnchor: [17, 17] })

export default function Xarita({ markaz, zoom, nuqtalar, balandlik = 340 }){
  return (
    <div className="varaq overflow-hidden relative isolate z-0" style={{ height: balandlik }}>
      <MapContainer center={[markaz.lat, markaz.lng]} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {nuqtalar.map(n => (
          <Marker key={n.id} position={[n.gps.lat, n.gps.lng]} icon={belgi(n.belgi, n.klass)} eventHandlers={{ click: n.bosish }}>
            <Tooltip direction="top" offset={[0, -16]}>{n.nom}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
