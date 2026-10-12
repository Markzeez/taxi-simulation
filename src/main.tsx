import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// MapLibre GL JS v6 is ESM-only and loads its tile-processing web worker from
// a separate file. Bundlers (Vite, webpack, etc.) cannot auto-resolve that URL
// at runtime, so we must tell MapLibre where the worker lives before the first
// map is created. The `?url` Vite suffix emits the worker as a hashed asset and
// returns its final public URL.
import { setWorkerUrl } from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
setWorkerUrl(maplibreWorkerUrl)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
