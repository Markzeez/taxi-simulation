import { useAppStore } from '../state/store'
import type { CameraMode, SpeedMultiplier } from '../state/types'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Navigation, Radio } from 'lucide-react'

const modes: CameraMode[] = ['chase', 'top', 'free']
const speeds: SpeedMultiplier[] = [1, 2, 4, 8]

export function TopBar() {
  const mode = useAppStore((state) => state.cameraMode)
  const speed = useAppStore((state) => state.speedMultiplier)
  const status = useAppStore((state) => state.simulationStatus)
  const setMode = useAppStore((state) => state.setCameraMode)
  const setSpeed = useAppStore((state) => state.setSpeedMultiplier)

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">⌁</div>
        <div>
          <div className="brand-title">NYC TAXI · NTC-7429</div>
          <div className="brand-subtitle">Marcus Vance <span>·</span> 4.8 rating <span>·</span> Downtown shift</div>
        </div>
      </div>

      <div className="guidance">
        <div className="guidance-icon"><Navigation size={17} /></div>
        <div>
          <div className="eyebrow">Live guidance</div>
          <strong>On 8th Avenue</strong>
        </div>
        <span className="guidance-distance">540 ft</span>
      </div>

      <div className="top-controls">
        <div className="segmented">
          {modes.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={mode === item ? 'secondary' : 'ghost'}
              className={mode === item ? 'selected' : ''}
              aria-pressed={mode === item}
              onClick={() => setMode(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="segmented compact">
          {speeds.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={speed === item ? 'secondary' : 'ghost'}
              className={speed === item ? 'selected' : ''}
              aria-pressed={speed === item}
              onClick={() => setSpeed(item)}
            >
              {item}x
            </Button>
          ))}
        </div>
        <Badge
          variant={status === 'running' ? 'success' : 'outline'}
          className={`simulation-status ${status}`}
          title={status}
        >
          <Radio size={12} />
          {status}
        </Badge>
      </div>
    </header>
  )
}
