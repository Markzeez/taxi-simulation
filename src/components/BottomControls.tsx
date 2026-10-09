
import { useAppStore } from '../state/store'

export function BottomControls() {
  const status = useAppStore((state) => state.simulationStatus)
  const start = useAppStore((state) => state.startSimulation)
  const pause = useAppStore((state) => state.pauseSimulation)
  const reset = useAppStore((state) => state.resetSimulation)
  const elapsed = useAppStore((state) => state.elapsedMs)
  const speed = useAppStore((state) => state.speedMultiplier)
  const time = `00:${String(Math.floor(elapsed / 1000)).padStart(2, '0')}`

  return <div className="bottom-controls">
    <button className="control-square" onClick={reset} aria-label="Reset">↶</button>
    <button className="control-square" onClick={status === 'running' ? pause : start} aria-label="Play or pause">{status === 'running' ? 'Ⅱ' : '▶'}</button>
    <div className="timeline"><span className="timeline-fill" style={{ width: `${Math.min(100, (elapsed / 42000) * 100)}%` }} /><i /></div>
    <span className="clock">{time}</span>
    <span className="speed-readout">{speed}x</span>
    <button className="control-square" onClick={() => useAppStore.getState().setCameraMode('free')} aria-label="Free camera">⌖</button>
  </div>
}
