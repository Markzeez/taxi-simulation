import type { ReactNode } from 'react'
import { Card } from './ui/card'

export function Panel({ className = '', children }: { className?: string; children: ReactNode }) {
  return <Card className={`panel ${className}`}>{children}</Card>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>
}
