import * as maplibregl from 'maplibre-gl'

export function createTaxiMarker() {
  const element = document.createElement('div')
  element.className = 'taxi-marker'
  element.setAttribute('role', 'img')
  element.setAttribute('aria-label', 'Active taxi location')
  element.innerHTML = `
    <span class="taxi-marker__pulse"></span>
    <span class="taxi-marker__shadow"></span>
    <svg class="taxi-marker__vehicle" viewBox="0 0 64 96" aria-hidden="true">
      <defs>
        <linearGradient id="taxi-paint" x1="0" x2="0" y1="0" y2="1">
          <stop stop-color="#ffe86f" />
          <stop offset=".48" stop-color="#ffc329" />
          <stop offset="1" stop-color="#ed8b13" />
        </linearGradient>
      </defs>
      <path d="M18 25 25 13h14l7 12c7 3 10 9 10 18v34c0 6-5 11-11 11H19c-6 0-11-5-11-11V43c0-9 3-15 10-18Z" fill="url(#taxi-paint)" stroke="#fff5ae" stroke-width="2.5" />
      <path d="M22 27 27 17h10l5 10v12H22Z" fill="#192c41" stroke="#ffffff" stroke-opacity=".8" stroke-width="2" />
      <path d="M27 8h10c2 0 3 2 3 4v4H24v-4c0-2 1-4 3-4Z" fill="#fff4a9" stroke="#9a5b08" stroke-width="1.5" />
      <text x="32" y="13" text-anchor="middle" fill="#5a3200" font-size="6" font-family="sans-serif" font-weight="800">TAXI</text>
      <path d="M11 45h7v9h-7Zm35 0h7v9h-7Z" fill="#ffffff" />
      <path d="M11 68h7v8h-7Zm35 0h7v8h-7Z" fill="#e94835" />
      <path d="M16 58h32" stroke="#a35a09" stroke-width="2" stroke-dasharray="5 3" opacity=".85" />
      <circle cx="18" cy="82" r="5" fill="#17202c" stroke="#fff1a0" stroke-width="2" />
      <circle cx="46" cy="82" r="5" fill="#17202c" stroke="#fff1a0" stroke-width="2" />
    </svg>
    <span class="taxi-marker__label">LIVE TAXI</span>
  `

  return new maplibregl.Marker({
    element,
    rotationAlignment: 'map',
    pitchAlignment: 'map',
    anchor: 'center',
  })
}
