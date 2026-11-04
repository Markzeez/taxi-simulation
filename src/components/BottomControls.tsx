
import { useAppStore } from '../state/store'
import { Button } from './ui/button'
import { Maximize2, Pause, Play, RotateCcw } from 'lucide-react'

export function BottomControls() {
  const status = useAppStore((state) => state.simulationStatus)
  const start = useAppStore((state) => state.startSimulation)
  const pause = useAppStore((state) => state.pauseSimulation)
  const reset = useAppStore((state) => state.resetSimulation)
  const elapsed = useAppStore((state) => state.elapsedMs)
  const speed = useAppStore((state) => state.speedMultiplier)
  const time = `00:${String(Math.floor(elapsed / 1000)).padStart(2, '0')}`
  const isRunning = status === 'running'

  return <div className="bottom-controls">
    <Button size="icon" variant="ghost" className="control-square" onClick={reset} aria-label="Reset"><RotateCcw size={16} /></Button>
    <Button size="icon" variant="default" className="control-square play-control" onClick={isRunning ? pause : start} aria-label={isRunning ? 'Pause' : 'Play'}>
      {isRunning ? <Pause size={16} /> : <Play size={16} />}
    </Button>
    <div className="timeline"><span className="timeline-fill" style={{ width: `${Math.min(100, (elapsed / 42000) * 100)}%` }} /><i /></div>
    <span className="clock">{time}</span>
    <span className="speed-readout">{speed}x</span>
    <Button size="icon" variant="ghost" className="control-square" onClick={() => useAppStore.getState().setCameraMode('free')} aria-label="Free camera"><Maximize2 size={16} /></Button>
  </div>
}
