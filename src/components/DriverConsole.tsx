import type { Trip } from '../state/types'
import { Panel, Eyebrow } from './Panel'

export function DriverConsole({ trip }: { trip: Trip }) {
  const progress = Math.round(trip.progress * 100)
  return (
    <Panel className="driver-console">
      <div className="panel-heading">
        <div><Eyebrow>Driver console</Eyebrow><h2>Today&apos;s shift</h2></div>
        <div className="ring"><span>{progress}%</span><small>complete</small></div>
      </div>
      <div className="earnings"><span>Gross earnings</span><strong>${(82.5 + trip.progress * 24).toFixed(2)}</strong></div>
      <div className="stat-list">
        <Stat label="Rides" value="8" meta="2 / 8" />
        <Stat label="Passengers" value={String(trip.passengers)} meta="on board" />
        <Stat label="Distance" value={`${(18 + trip.progress * 2.7).toFixed(1)} mi`} meta="today" />
      </div>
    </Panel>
  )
}

function Stat({ label, value, meta }: { label: string; value: string; meta: string }) {
  return <div className="stat-row"><span className="stat-icon">•</span><div><b>{label}</b><small>{meta}</small></div><strong>{value}</strong></div>
}
