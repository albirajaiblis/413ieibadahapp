/* Offline City Database & Coordinates for Indonesia & World Fallbacks */
export const CITIES_DATABASE = [
  { id: 'jakarta', name: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, timezone: 7 },
  { id: 'bandung', name: 'Bandung, Jawa Barat', lat: -6.9175, lng: 107.6191, timezone: 7 },
  { id: 'surabaya', name: 'Surabaya, Jawa Timur', lat: -7.2575, lng: 112.7521, timezone: 7 },
  { id: 'medan', name: 'Medan, Sumatera Utara', lat: 3.5952, lng: 98.6722, timezone: 7 },
  { id: 'semarang', name: 'Semarang, Jawa Tengah', lat: -6.9667, lng: 110.4167, timezone: 7 },
  { id: 'makassar', name: 'Makassar, Sulawesi Selatan', lat: -5.1477, lng: 119.4327, timezone: 8 },
  { id: 'palembang', name: 'Palembang, Sumatera Selatan', lat: -2.9761, lng: 104.7754, timezone: 7 },
  { id: 'depok', name: 'Depok, Jawa Barat', lat: -6.4025, lng: 106.7942, timezone: 7 },
  { id: 'tangerang', name: 'Tangerang, Banten', lat: -6.1783, lng: 106.6319, timezone: 7 },
  { id: 'bekasi', name: 'Bekasi, Jawa Barat', lat: -6.2383, lng: 106.9756, timezone: 7 },
  { id: 'yogyakarta', name: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695, timezone: 7 },
  { id: 'surakarta', name: 'Surakarta / Solo', lat: -7.5755, lng: 110.8243, timezone: 7 },
  { id: 'malang', name: 'Malang, Jawa Timur', lat: -7.9666, lng: 112.6326, timezone: 7 },
  { id: 'bogor', name: 'Bogor, Jawa Barat', lat: -6.5971, lng: 106.7996, timezone: 7 },
  { id: 'banda_aceh', name: 'Banda Aceh, Aceh', lat: 5.5483, lng: 95.3238, timezone: 7 },
  { id: 'pekanbaru', name: 'Pekanbaru, Riau', lat: 0.5071, lng: 101.4478, timezone: 7 },
  { id: 'padang', name: 'Padang, Sumatera Barat', lat: -0.9471, lng: 100.4172, timezone: 7 },
  { id: 'batam', name: 'Batam, Kepulauan Riau', lat: 1.1301, lng: 104.0529, timezone: 7 },
  { id: 'bandar_lampung', name: 'Bandar Lampung', lat: -5.4500, lng: 105.2667, timezone: 7 },
  { id: 'denpasar', name: 'Denpasar, Bali', lat: -8.6705, lng: 115.2126, timezone: 8 },
  { id: 'mataram', name: 'Mataram, NTB', lat: -8.5833, lng: 116.1167, timezone: 8 },
  { id: 'kupang', name: 'Kupang, NTT', lat: -10.1772, lng: 123.6070, timezone: 8 },
  { id: 'banjarmasin', name: 'Banjarmasin, Kalsel', lat: -3.3194, lng: 114.5908, timezone: 8 },
  { id: 'samarinda', name: 'Samarinda, Kaltim', lat: -0.5022, lng: 117.1536, timezone: 8 },
  { id: 'pontianak', name: 'Pontianak, Kalbar', lat: -0.0263, lng: 109.3425, timezone: 7 },
  { id: 'manado', name: 'Manado, Sulawesi Utara', lat: 1.4748, lng: 124.8428, timezone: 8 },
  { id: 'ambon', name: 'Ambon, Maluku', lat: -3.6554, lng: 128.1906, timezone: 9 },
  { id: 'jayapura', name: 'Jayapura, Papua', lat: -2.5489, lng: 140.7186, timezone: 9 },
  { id: 'makkah', name: 'Makkah Al-Mukarramah', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { id: 'madinah', name: 'Madinah Al-Munawwarah', lat: 24.4672, lng: 39.6112, timezone: 3 },
  { id: 'kuala_lumpur', name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, timezone: 8 },
  { id: 'singapore', name: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 8 }
];

export function getCityById(id) {
  return CITIES_DATABASE.find(c => c.id === id) || CITIES_DATABASE[0];
}
