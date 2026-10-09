import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'

import { useAppStore } from '../state/store'
import type { Coordinate } from '../state/types'
import { getPositionAtProgress } from '../simulation/tripEngine'
import { createTaxiMarker } from '../components/TaxiMarker'

import { updateCamera } from './cameraController'
import { createMap } from './mapSetup'

import {
  add3DBuildings,
  addTripLayers,
  updateProgressRoute,
  updateTripRoute,
} from './mapLayers'

import {
  addTrailLayer,
  updateTrail,
} from './trailLayer'

function fitMapToRoute(map: maplibregl.Map, coordinates: Coordinate[]) {
  if (coordinates.length === 0) return

  const bounds = new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
  coordinates.slice(1).forEach((coordinate) => bounds.extend(coordinate))

  const isCompact = map.getContainer().clientWidth < 700

  map.fitBounds(bounds, {
    padding: isCompact
      ? { top: 75, right: 45, bottom: 160, left: 45 }
      : { top: 120, right: 245, bottom: 125, left: 245 },
    maxZoom: 15.2,
    pitch: isCompact ? 38 : 52,
    duration: 0,
  })
}

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)

  const trailRef = useRef<[number, number][]>([])
  const lastTripIdRef = useRef<string | null>(null)

  /*
   * We intentionally don't subscribe to the whole store here.
   * The simulation loop reads the latest Zustand state with
   * useAppStore.getState().
   */
  const activeTrip = useAppStore((state) =>
    state.trips.find((trip) => trip.id === state.activeTripId)
  )

  /*
   * ---------------------------------------------------------
   * MAP INITIALIZATION
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!containerRef.current) return

    const map = createMap(containerRef.current)

    mapRef.current = map

    const handleMapLoad = () => {
      const state = useAppStore.getState()

      const trip = state.trips.find(
        (item) => item.id === state.activeTripId
      )

      /*
       * Add static map content first.
       */
      add3DBuildings(map)
      addTrailLayer(map)

      /*
       * If there is an active trip when the map loads,
       * initialize its route and taxi marker.
       */
      if (!trip || trip.routeCoords.length === 0) return

      addTripLayers(map, trip)
      map.resize()
      fitMapToRoute(map, trip.routeCoords)

      const marker = createTaxiMarker()

      marker
        .setLngLat(trip.routeCoords[0])
        .addTo(map)

      markerRef.current = marker

      trailRef.current = [trip.routeCoords[0]]

      updateTrail(map, trailRef.current)

      lastTripIdRef.current = trip.id
    }

    map.on('load', handleMapLoad)

    /*
     * -------------------------------------------------------
     * CLEANUP
     * -------------------------------------------------------
     */
    return () => {
      map.off('load', handleMapLoad)

      markerRef.current?.remove()
      markerRef.current = null

      map.remove()
      mapRef.current = null

      trailRef.current = []
      lastTripIdRef.current = null
    }
  }, [])

  /*
   * ---------------------------------------------------------
   * ACTIVE TRIP CHANGED
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const map = mapRef.current

    if (!map || !activeTrip) return

    /*
     * Don't reset the route when unrelated Zustand state
     * changes.
     */
    if (lastTripIdRef.current === activeTrip.id) return

    if (activeTrip.routeCoords.length === 0) return

    lastTripIdRef.current = activeTrip.id

    /*
     * Reset trail for the new trip.
     */
    trailRef.current = [activeTrip.routeCoords[0]]

    /*
     * Update route layers.
     */
    updateTripRoute(map, activeTrip)
    fitMapToRoute(map, activeTrip.routeCoords)

    /*
     * Update taxi marker.
     */
    if (markerRef.current) {
      markerRef.current
        .setLngLat(activeTrip.routeCoords[0])
        .setRotation(0)
    }

    /*
     * Reset displayed trail.
     */
    updateTrail(map, trailRef.current)
  }, [activeTrip])

  /*
   * ---------------------------------------------------------
   * SIMULATION LOOP
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const state = useAppStore.getState()

      if (state.simulationStatus !== 'running') {
        return
      }

      const trip = state.trips.find(
        (item) => item.id === state.activeTripId
      )

      if (!trip || trip.routeCoords.length < 2) {
        return
      }

      const map = mapRef.current
      const marker = markerRef.current

      if (!map || !marker) {
        return
      }

      /*
       * Base trip duration.
       *
       * 42 seconds at 1x speed.
       */
      const durationMs = 42_000 / state.speedMultiplier

      /*
       * Advance simulation by 100ms.
       */
      const nextElapsed = Math.min(
        state.elapsedMs + 100,
        durationMs
      )

      const progress = Math.min(
        1,
        nextElapsed / durationMs
      )

      /*
       * Update Zustand.
       */
      state.setElapsedMs(nextElapsed)
      state.updateProgress(progress)

      /*
       * Calculate taxi position from route.
       */
      const position = getPositionAtProgress(
        trip.routeCoords,
        progress
      )

      if (!position) {
        return
      }

      /*
       * Update taxi marker.
       */
      marker
        .setLngLat(position.lngLat)
        .setRotation(position.bearing)

      /*
       * Update route progress.
       */
      updateProgressRoute(
        map,
        trip.routeCoords,
        progress
      )

      /*
       * Camera follows taxi unless the user selected
       * free camera mode.
       */
      if (state.cameraMode !== 'free') {
        updateCamera(
          map,
          state.cameraMode,
          position.lngLat,
          position.bearing
        )
      }

      /*
       * -----------------------------------------------------
       * TRAIL
       * -----------------------------------------------------
       */

      const lastPosition = trailRef.current.at(-1)

      const shouldAddTrailPoint =
        !lastPosition ||
        Math.abs(
          lastPosition[0] - position.lngLat[0]
        ) +
          Math.abs(
            lastPosition[1] - position.lngLat[1]
          ) >
          0.00012

      if (shouldAddTrailPoint) {
        trailRef.current.push(position.lngLat)

        updateTrail(
          map,
          trailRef.current
        )
      }

      /*
       * -----------------------------------------------------
       * TRIP COMPLETED
       * -----------------------------------------------------
       */
      if (progress >= 1) {
        state.completeActiveTrip()
      }
    }, 100)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="map-canvas h-full w-full"
      aria-label="3D taxi map"
    />
  )
}