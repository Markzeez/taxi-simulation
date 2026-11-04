import taxiMarkerIcon from '../assets/favicon.ico'

export function createTaxiMarkerElement() {
  const element = document.createElement('div')
  element.className = 'taxi-marker'
  element.setAttribute('role', 'img')
  element.setAttribute('aria-label', 'Active taxi location')
  element.innerHTML = `
    <span class="taxi-marker__pulse"></span>
    <span class="taxi-marker__shadow"></span>
    <img class="taxi-marker__vehicle" src="${taxiMarkerIcon}" alt="" />
    <span class="taxi-marker__label">LIVE TAXI</span>
  `

  return element
}
