export type Coordinate = [number, number]

export type TripStatus = 'upcoming' | 'active' | 'completed'
export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed'
export type CameraMode = 'chase' | 'top' | 'free'
export type SpeedMultiplier = 1 | 2 | 4 | 8

export interface Trip {
  id: string
  status: TripStatus
  pickup: string
  dropoff: string
  fare: number
  passengers: number
  routeCoords: Coordinate[]
  progress: number
  targetSpeedMph: number
}
