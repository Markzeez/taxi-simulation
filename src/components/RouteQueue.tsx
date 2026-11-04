import { useAppStore } from '../state/store'
import { Panel, Eyebrow } from './Panel'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export function RouteQueue() {
  const trips = useAppStore((state) => state.trips)
  const activeId = useAppStore((state) => state.activeTripId)
  const setActive = useAppStore((state) => state.setActiveTripById)

  return (
    <Panel className="route-queue">
      <div className="panel-heading"><div><Eyebrow>Ride queue</Eyebrow><h2>Today&apos;s route</h2></div><Badge variant="secondary" className="queue-count">{trips.length}/5</Badge></div>
      <div className="queue-list">
        {trips.map((trip, index) => (
          <Button
            key={trip.id}
            variant="ghost"
            className={`queue-item ${activeId === trip.id ? 'active' : ''}`}
            aria-pressed={activeId === trip.id}
            onClick={() => setActive(trip.id)}
          >
            <span className="queue-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="queue-main"><b>{trip.pickup} <i>→</i> {trip.dropoff}</b><small>{trip.status === 'completed' ? 'COMPLETED' : index === 0 ? '08:12 AM' : 'NEXT'} · {trip.passengers} passengers</small></span>
            <strong>${trip.fare.toFixed(2)}</strong>
          </Button>
        ))}
      </div>
    </Panel>
  )
}
