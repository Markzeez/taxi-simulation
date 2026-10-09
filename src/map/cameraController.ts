import type { Map } from 'maplibre-gl'
import type { CameraMode, Coordinate } from '../state/types'

export function updateCamera(map: Map, mode: CameraMode, position: Coordinate, taxiBearing: number) {
  if (mode === 'free') return

  if (mode === 'top') {
    map.jumpTo({ center: position, bearing: 0, pitch: 0, zoom: 15.6 })
    return
  }

  map.jumpTo({ center: position, bearing: taxiBearing, pitch: 61, zoom: 16.9 })
}
