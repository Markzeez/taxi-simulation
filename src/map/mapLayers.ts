import type { GeoJSONSource, Map } from 'maplibre-gl'
import type { Coordinate, Trip } from '../state/types'

const route = (coords: Coordinate[]) => ({
  type: 'Feature' as const,
  properties: {},
  geometry: { type: 'LineString' as const, coordinates: coords },
})

export function add3DBuildings(map: Map) {
  const styleLayers = map.getStyle().layers ?? []
  const labelLayer = styleLayers.find((layer) => layer.type === 'symbol' && Boolean(layer.layout?.['text-field']))?.id
  const buildingLayer = styleLayers.find(
    (layer): layer is typeof layer & { source?: string; 'source-layer'?: string } =>
      (layer as { 'source-layer'?: string })['source-layer'] === 'building',
  )
  const buildingSource = buildingLayer?.source

  if (!buildingSource || map.getLayer('taxi-3d-buildings')) return

  map.addLayer({
    id: 'taxi-3d-buildings',
    type: 'fill-extrusion',
    source: buildingSource,
    'source-layer': 'building',
    minzoom: 14,
    filter: ['!=', ['get', 'hide_3d'], true],
    paint: {
      'fill-extrusion-color': [
        'interpolate', ['linear'], ['get', 'render_height'],
        0, '#21161d',
        30, '#2a1a22',
        90, '#38232d',
        180, '#4a2b37',
      ],
      'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.6, ['coalesce', ['get', 'render_height'], 10]],
      'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
      'fill-extrusion-opacity': 0.88,
      'fill-extrusion-vertical-gradient': true,
    },
  }, labelLayer)
}

export function addTripLayers(map: Map, trip: Trip) {
  if (!map.getSource('active-route')) {
    map.addSource('active-route', { type: 'geojson', data: route(trip.routeCoords) })
    map.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'active-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ff5b91', 'line-width': 12, 'line-opacity': 0.12, 'line-blur': 5 },
    })
    map.addLayer({
      id: 'route-main',
      type: 'line',
      source: 'active-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ff739f', 'line-width': 3.2, 'line-opacity': 0.95 },
    })
  }

  if (!map.getSource('route-progress')) {
    map.addSource('route-progress', { type: 'geojson', data: route(trip.routeCoords.slice(0, 1)) })
    map.addLayer({
      id: 'route-progress',
      type: 'line',
      source: 'route-progress',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ffd2df', 'line-width': 4.4, 'line-opacity': 0.85 },
    })
  }

  if (!map.getSource('route-points')) {
    map.addSource('route-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          { type: 'Feature', properties: { kind: 'pickup' }, geometry: { type: 'Point', coordinates: trip.routeCoords[0] } },
          { type: 'Feature', properties: { kind: 'dropoff' }, geometry: { type: 'Point', coordinates: trip.routeCoords.at(-1)! } },
        ],
      },
    })
    map.addLayer({
      id: 'route-points',
      type: 'circle',
      source: 'route-points',
      paint: {
        'circle-color': ['match', ['get', 'kind'], 'pickup', '#f2a8bd', '#ff5b91'],
        'circle-radius': ['match', ['get', 'kind'], 'pickup', 4, 6],
        'circle-stroke-color': '#fff1f6',
        'circle-stroke-width': 1,
        'circle-opacity': 0.95,
      },
    })
  }
}

export function updateTripRoute(map: Map, trip: Trip) {
  ;(map.getSource('active-route') as GeoJSONSource | undefined)?.setData(route(trip.routeCoords))
  ;(map.getSource('route-points') as GeoJSONSource | undefined)?.setData({
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { kind: 'pickup' }, geometry: { type: 'Point', coordinates: trip.routeCoords[0] } },
      { type: 'Feature', properties: { kind: 'dropoff' }, geometry: { type: 'Point', coordinates: trip.routeCoords.at(-1)! } },
    ],
  })
}

export function updateProgressRoute(map: Map, coords: Coordinate[], progress: number) {
  if (coords.length < 2) return
  const count = Math.max(2, Math.ceil((coords.length - 1) * progress) + 1)
  const partial = coords.slice(0, Math.min(coords.length, count))
  ;(map.getSource('route-progress') as GeoJSONSource | undefined)?.setData(route(partial))
}
