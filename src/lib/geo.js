// Ikki nuqta orasidagi masofa (metr) — haversine formulasi
export function masofa(a, b){
  const R = 6371000, r = x => x * Math.PI / 180
  const dLat = r(b.lat - a.lat), dLng = r(b.lng - a.lng)
  const h = Math.sin(dLat/2)**2 + Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(h))
}
export function joylashuv(){
  return new Promise((ok, xato) => {
    if (!navigator.geolocation) return xato(new Error('no-geo'))
    navigator.geolocation.getCurrentPosition(
      p => ok({ lat: p.coords.latitude, lng: p.coords.longitude, aniqlik: p.coords.accuracy }),
      e => xato(e), { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 })
  })
}
