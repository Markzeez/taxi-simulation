import { MapView } from '../map/mapView'
import { TopBar } from './TopBar'
import { DriverConsole } from './DriverConsole'
import { LiveBooking } from './LiveBooking'
import { RouteQueue } from './RouteQueue'
import { CarStatus } from './CarStatus'
import { BottomControls } from './BottomControls'
import { useAppStore } from '../state/store'

export function Dashboard() {
  const activeTrip = useAppStore((state) =>
    state.trips.find((trip) => trip.id === state.activeTripId) ?? state.trips[0]
  )

  return (
    <main className="dashboard">
      <MapView />
      <div className="map-vignette" />
      <TopBar />
      <DriverConsole trip={activeTrip} />
      <LiveBooking trip={activeTrip} />
      <RouteQueue />
      <CarStatus trip={activeTrip} />
      <BottomControls />
    </main>
  )
}
