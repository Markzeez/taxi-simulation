import { useAppStore } from '../state/store'
import type { CameraMode, SpeedMultiplier } from '../state/types'

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
        <div className="guidance-icon">↗</div>
        <div>
          <div className="eyebrow">Live guidance</div>
          <strong>On 8th Avenue</strong>
        </div>
        <span className="guidance-distance">540 ft</span>
      </div>

      <div className="top-controls">
        <div className="segmented">
          {modes.map((item) => (
            <button key={item} className={mode === item ? 'selected' : ''} onClick={() => setMode(item)}>{item}</button>
          ))}
        </div>
        <div className="segmented compact">
          {speeds.map((item) => (
            <button key={item} className={speed === item ? 'selected' : ''} onClick={() => setSpeed(item)}>{item}x</button>
          ))}
        </div>
        <div className={`status-dot ${status}`} title={status} />
      </div>
    </header>
  )
}
