import type { Trip } from '../state/types'
import { Panel, Eyebrow } from './Panel'

export function CarStatus({ trip }: { trip: Trip }) {
  return <Panel className="car-status"><div className="car-top"><div><Eyebrow>NTC-7429 · Active car</Eyebrow><h2>Marcus Vance</h2></div><span className="online">● online</span></div><div className="car-destination"><Eyebrow>Next stop</Eyebrow><strong>{trip.dropoff}</strong></div><div className="car-progress"><span style={{ width: `${Math.max(6, trip.progress * 100)}%` }} /></div><div className="car-meta"><span>Trip {trip.id}</span><span>{Math.round(trip.progress * 100)}% complete</span></div></Panel>
}
