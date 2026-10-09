import type { Trip } from '../state/types'

// Nigeria-shaped demo routes chosen to match the visual language of the reference recording.
export const trips: Trip[] = [
  {
    id: 'TRIP-01',
    status: 'active',
    pickup: 'Murtala Muhammed International Airport (LOS), Ikeja',
    dropoff: 'Ikoyi (Awolowo Road), Lagos',
    fare: 16500.0,
    passengers: 2,
    progress: 0.22,
    targetSpeedMph: 28,
    routeCoords: [
      [3.3211, 6.5774], // MMIA Airport
      [3.3350, 6.5610], // Oshodi-Apapa Expressway
      [3.3520, 6.5330], // Ikorodu Road Interchange
      [3.3680, 6.5150], // Fadeyi
      [3.3750, 6.4980], // Yaba / Ebute Metta
      [3.3820, 6.4750], // Third Mainland Bridge Approach
      [3.3910, 6.4530], // Third Mainland Bridge Midpoint
      [3.4020, 6.4410], // Adeniji Adele Exit
      [3.4140, 6.4320], // Obalende
      [3.4250, 6.4280], // Kingsway Road / Awolowo Road
      [3.4320, 6.4250], // Ikoyi Destination
    ],
  },
  {
    id: 'TRIP-02',
    status: 'upcoming',
    pickup: 'Lekki Phase 1 Gate',
    dropoff: 'Victoria Island (Adetokunbo Ademola St)',
    fare: 9800.0,
    passengers: 1,
    progress: 0,
    targetSpeedMph: 24,
    routeCoords: [
      [3.4601, 6.4382], // Lekki Phase 1
      [3.4480, 6.4310], // Lekki-Epe Expressway Toll Plaza area
      [3.4310, 6.4260], // Lekki-Ikoyi Link Bridge
      [3.4190, 6.4220], // Falomo Roundabout
      [3.4110, 6.4250], // Akin Adesola St
      [3.4075, 6.4292], // Victoria Island Destination
    ],
  },
  {
    id: 'TRIP-03',
    status: 'upcoming',
    pickup: 'Nnamdi Azikiwe International Airport (ABV), Abuja',
    dropoff: 'Central Business District (CBD), Abuja',
    fare: 68500.0,
    passengers: 2,
    progress: 0,
    targetSpeedMph: 34,
    routeCoords: [
      [7.2632, 9.0066], // Abuja Airport
      [7.2910, 9.0120], // Airport Road (Umaru Musa Yar'Adua Road)
      [7.3250, 9.0210], // Kuje Junction
      [7.3680, 9.0340], // Lugbe Sector F
      [7.4020, 9.0430], // Chika Area
      [7.4410, 9.0520], // National Stadium Interchange
      [7.4680, 9.0550], // Kukwaba
      [7.4890, 9.0580], // Area 1 Garki
      [7.4950, 9.0620], // Independence Avenue
      [7.5120, 9.0661], // Abuja CBD Destination
    ],
  },
  {
    id: 'TRIP-04',
    status: 'upcoming',
    pickup: 'Port Harcourt International Airport (PHC), Omagwa',
    dropoff: 'GRA Phase 2, Port Harcourt',
    fare: 24750.0,
    passengers: 3,
    progress: 0,
    targetSpeedMph: 26,
    routeCoords: [
      [6.9496, 5.0152], // PHC Airport
      [6.9610, 4.9820], // Airport Road
      [6.9740, 4.9310], // Igwuruta
      [6.9850, 4.8850], // Rumuokoro Roundabout
      [6.9930, 4.8510], // Port Harcourt-Aba Expressway
      [6.9960, 4.8290], // Rumuola Junction
      [6.9890, 4.8180], // Olu Obasanjo Road
      [6.9814, 4.8115], // GRA Phase 2 Destination
    ],
  },
]
