import * as maplibregl from 'maplibre-gl'

export type MapCenter = [number, number]

export const DEFAULT_CENTER: MapCenter = [3.3792, 6.5244]

export const MAP_STYLE =
  'https://tiles.openfreemap.org/styles/liberty'

export const DEFAULT_MAP_OPTIONS = {
  zoom: 12,
  pitch: 52,
  bearing: -18,
} as const

export function createMap(
  container: HTMLElement
): maplibregl.Map {
  const map = new maplibregl.Map({
    container,
    style: MAP_STYLE,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_MAP_OPTIONS.zoom,
    pitch: DEFAULT_MAP_OPTIONS.pitch,
    bearing: DEFAULT_MAP_OPTIONS.bearing,
    maxPitch: 70,
    attributionControl: false,
  })

  return map
}