import { along, bearing, length, lineString, point } from '@turf/turf'
import type { Coordinate } from '../state/types'

export interface TripPosition {
  lngLat: Coordinate
  bearing: number
  totalKm: number
  traveledKm: number
  distanceRemainingKm: number
  progress: number
}

export function getPositionAtProgress(coords: Coordinate[], progressRatio: number): TripPosition | null {
  if (coords.length < 2) return null

  const progress = Math.max(0, Math.min(1, progressRatio))
  const route = lineString(coords)
  const totalKm = length(route, { units: 'kilometers' })
  if (totalKm <= 0) return null

  const traveledKm = totalKm * progress
  const current = along(route, traveledKm, { units: 'kilometers' })
  const lookKm = Math.min(totalKm, traveledKm + 0.03)
  const look = along(route, lookKm, { units: 'kilometers' })
  const heading = progress >= 1
    ? bearing(point(along(route, Math.max(0, traveledKm - 0.03), { units: 'kilometers' }).geometry.coordinates), current)
    : bearing(current, look)

  return {
    lngLat: current.geometry.coordinates as Coordinate,
    bearing: heading,
    totalKm,
    traveledKm,
    distanceRemainingKm: Math.max(0, totalKm - traveledKm),
    progress,
  }
}
