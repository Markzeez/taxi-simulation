import type { Trip } from '../state/types'
import { Panel, Eyebrow } from './Panel'

export function LiveBooking({ trip }: { trip: Trip }) {
  const progress = Math.round(trip.progress * 100)
  const eta = Math.max(2, Math.ceil((1 - trip.progress) * 8))
  return (
    <Panel className="live-booking">
      <div className="panel-heading"><div><Eyebrow>Live booking</Eyebrow><h2>{trip.id}</h2></div><span className="rush">Morning Rush</span></div>
      <div className="destination-block">
        <div className="destination-label">Heading to</div>
        <strong>{trip.dropoff}</strong>
        <div className="mini-progress"><span style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="metrics"><Metric label="Last fare" value={`$${trip.fare.toFixed(2)}`} /><Metric label="Speed" value={`${trip.targetSpeedMph} MPH`} /><Metric label="Distance" value={`${(0.5 + (1 - trip.progress) * 1.8).toFixed(1)} MI`} /></div>
      <div className="booking-route">
        <div className="route-pin pickup" />
        <div><Eyebrow>Pickup</Eyebrow><b>{trip.pickup}</b><small>Passenger onboard</small></div>
      </div>
      <div className="booking-route">
        <div className="route-pin drop" />
        <div><Eyebrow>Destination</Eyebrow><b>{trip.dropoff}</b><small>ETA · {eta} min</small></div>
      </div>
      <div className="booking-footer"><span>Passenger On Board</span><span className="avatars">● ● ●</span></div>
    </Panel>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><Eyebrow>{label}</Eyebrow><strong>{value}</strong></div>
}
