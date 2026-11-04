import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'

import { createTaxiMarkerElement } from '../components/TaxiMarker'
import { getPositionAtProgress } from '../simulation/tripEngine'
import { useAppStore } from '../state/store'
import type { Coordinate } from '../state/types'

import { updateCamera } from './cameraController'
import {
  add3DBuildings,
  addTripLayers,
  updateProgressRoute,
  updateTripRoute,
} from './mapLayers'
import { createMap } from './mapSetup'
import { addTrailLayer, updateTrail } from './trailLayer'
import { createTaxiThreeLayer } from './threeTaxiLayer'

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

function createTaxiMarker() {
  return new maplibregl.Marker({
    element: createTaxiMarkerElement(),
    rotationAlignment: 'map',
    pitchAlignment: 'map',
    anchor: 'center',
  })
}

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const taxiLayerRef = useRef<ReturnType<typeof createTaxiThreeLayer> | null>(null)
  const trailRef = useRef<Coordinate[]>([])
  const lastTripIdRef = useRef<string | null>(null)
  const activeTripId = useAppStore((state) => state.activeTripId)

  useEffect(() => {
    if (!containerRef.current) return

    const map = createMap(containerRef.current)
    mapRef.current = map

    const handleMapLoad = () => {
      const state = useAppStore.getState()
      const trip = state.trips.find((item) => item.id === state.activeTripId)

      add3DBuildings(map)
      addTrailLayer(map)

      if (trip && trip.routeCoords.length > 0) {
        addTripLayers(map, trip)
        fitMapToRoute(map, trip.routeCoords)

        const marker = createTaxiMarker()
        marker.setLngLat(trip.routeCoords[0]).addTo(map)
        markerRef.current = marker
        trailRef.current = [trip.routeCoords[0]]
        lastTripIdRef.current = trip.id
      }

      const taxiLayer = createTaxiThreeLayer()
      map.addLayer(taxiLayer, map.getLayer('route-points') ? 'route-points' : undefined)
      taxiLayerRef.current = taxiLayer
      if (trip?.routeCoords[0]) {
        taxiLayer.setPosition(trip.routeCoords[0], 0)
      }
    }

    map.on('load', handleMapLoad)

    return () => {
      map.off('load', handleMapLoad)
      markerRef.current?.remove()
      markerRef.current = null
      map.remove()
      mapRef.current = null
      taxiLayerRef.current = null
      trailRef.current = []
      lastTripIdRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map?.isStyleLoaded() || !activeTripId || lastTripIdRef.current === activeTripId) return

    const trip = useAppStore.getState().trips.find((item) => item.id === activeTripId)
    if (!trip || trip.routeCoords.length === 0) return

    lastTripIdRef.current = trip.id
    trailRef.current = [trip.routeCoords[0]]
    updateTripRoute(map, trip)
    fitMapToRoute(map, trip.routeCoords)

    if (!markerRef.current) {
      markerRef.current = createTaxiMarker().addTo(map)
    }
    markerRef.current.setLngLat(trip.routeCoords[0]).setRotation(0)
    taxiLayerRef.current?.setPosition(trip.routeCoords[0], 0)
    updateTrail(map, trailRef.current)
  }, [activeTripId])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const state = useAppStore.getState()
      if (state.simulationStatus !== 'running') return

      const trip = state.trips.find((item) => item.id === state.activeTripId)
      const map = mapRef.current
      const marker = markerRef.current
      const taxiLayer = taxiLayerRef.current

      if (!trip || trip.routeCoords.length < 2 || !map || !marker || !taxiLayer) return

      const durationMs = 42_000 / state.speedMultiplier
      const nextElapsed = Math.min(state.elapsedMs + 100, durationMs)
      const progress = Math.min(1, nextElapsed / durationMs)

      state.setElapsedMs(nextElapsed)
      state.updateProgress(progress)

      const position = getPositionAtProgress(trip.routeCoords, progress)
      if (!position) return

      marker.setLngLat(position.lngLat).setRotation(position.bearing)
      taxiLayer.setPosition(position.lngLat, position.bearing)
      updateProgressRoute(map, trip.routeCoords, progress)

      if (state.cameraMode !== 'free') {
        updateCamera(map, state.cameraMode, position.lngLat, position.bearing)
      }

      const lastPosition = trailRef.current.at(-1)
      const shouldAddTrailPoint =
        !lastPosition ||
        Math.abs(lastPosition[0] - position.lngLat[0]) +
          Math.abs(lastPosition[1] - position.lngLat[1]) >
          0.00012

      if (shouldAddTrailPoint) {
        trailRef.current.push(position.lngLat)
        updateTrail(map, trailRef.current)
      }

      if (progress >= 1) state.completeActiveTrip()
    }, 100)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div
      ref={containerRef}
      className="map-canvas h-full w-full"
      aria-label="3D taxi map"
    />
  )
}
