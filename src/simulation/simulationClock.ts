import type { SpeedMultiplier } from '../state/types'

export class SimulationClock {
  private frame: number | null = null
  private last = 0
  private elapsed = 0
  private running = false
  private speed: SpeedMultiplier = 1
  private listeners = new Set<(elapsedMs: number) => void>()

  start() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    this.tick(this.last)
  }

  pause() {
    this.running = false
    if (this.frame !== null) cancelAnimationFrame(this.frame)
    this.frame = null
  }

  reset() {
    this.elapsed = 0
    this.last = performance.now()
    this.emit()
  }

  setSpeed(speed: SpeedMultiplier) {
    this.speed = speed
  }

  getElapsed() { return this.elapsed }

  onTick(listener: (elapsedMs: number) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private tick = (now: number) => {
    if (!this.running) return
    const delta = Math.min(100, now - this.last)
    this.last = now
    this.elapsed += delta * this.speed
    this.emit()
    this.frame = requestAnimationFrame(this.tick)
  }

  private emit() {
    for (const listener of this.listeners) listener(this.elapsed)
  }
}
