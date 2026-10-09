import { create } from 'zustand'
import { trips as initialTrips } from '../data/trips'
import type { CameraMode, SimulationStatus, SpeedMultiplier, Trip } from './types'

interface AppStore {
  trips: Trip[]
  activeTripId: string
  simulationStatus: SimulationStatus
  elapsedMs: number
  speedMultiplier: SpeedMultiplier
  cameraMode: CameraMode
  setActiveTripById: (id: string) => void
  startSimulation: () => void
  pauseSimulation: () => void
  resetSimulation: () => void
  setSpeedMultiplier: (speed: SpeedMultiplier) => void
  setCameraMode: (mode: CameraMode) => void
  setElapsedMs: (elapsedMs: number) => void
  updateProgress: (progress: number) => void
  completeActiveTrip: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  trips: initialTrips,
  activeTripId: 'TRIP-01',
  simulationStatus: 'idle',
  elapsedMs: 0,
  speedMultiplier: 1,
  cameraMode: 'chase',

  setActiveTripById: (id) => set((state) => ({
    activeTripId: id,
    elapsedMs: 0,
    simulationStatus: 'idle',
    trips: state.trips.map((trip) => ({
      ...trip,
      status: trip.id === id ? 'active' : trip.status === 'active' ? 'upcoming' : trip.status,
      progress: trip.id === id ? 0 : trip.progress,
    })),
  })),

  startSimulation: () => set((state) => ({
    simulationStatus: state.activeTripId ? 'running' : 'idle',
  })),

  pauseSimulation: () => set({ simulationStatus: 'paused' }),

  resetSimulation: () => set((state) => ({
    simulationStatus: 'idle',
    elapsedMs: 0,
    trips: state.trips.map((trip) => trip.id === state.activeTripId ? { ...trip, progress: 0, status: 'active' } : trip),
  })),

  setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setElapsedMs: (elapsedMs) => set({ elapsedMs }),

  updateProgress: (progress) => set((state) => ({
    trips: state.trips.map((trip) => trip.id === state.activeTripId ? { ...trip, progress } : trip),
  })),

  completeActiveTrip: () => set((state) => {
    const next = state.trips.find((trip) => trip.status === 'upcoming' && trip.id !== state.activeTripId)
    return {
      simulationStatus: next ? 'idle' : 'completed',
      elapsedMs: 0,
      activeTripId: next?.id ?? state.activeTripId,
      trips: state.trips.map((trip) => {
        if (trip.id === state.activeTripId) return { ...trip, status: 'completed', progress: 1 }
        if (next && trip.id === next.id) return { ...trip, status: 'active', progress: 0 }
        return trip
      }),
    }
  }),
}))

export const selectActiveTrip = (state: AppStore): Trip => {
  return state.trips.find((trip) => trip.id === state.activeTripId) ?? state.trips[0]
}
