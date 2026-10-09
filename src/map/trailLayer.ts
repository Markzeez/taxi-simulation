import type { GeoJSONSource, Map } from 'maplibre-gl'
import type { Coordinate } from '../state/types'

export function addTrailLayer(map: Map) {
  if (map.getSource('taxi-trail')) return
  map.addSource('taxi-trail', {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
  })
  map.addLayer({
    id: 'taxi-trail',
    type: 'line',
    source: 'taxi-trail',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#ff7ba4', 'line-width': 2.2, 'line-opacity': 0.42, 'line-blur': 0.3 },
  })
}

export function updateTrail(map: Map, coords: Coordinate[]) {
  if (coords.length < 2) return
  ;(map.getSource('taxi-trail') as GeoJSONSource | undefined)?.setData({
    type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords },
  })
}
