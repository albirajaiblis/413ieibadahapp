/* Geolocation & Coordinate Engine */
import { CITIES_DATABASE } from './cityData.js';
import { Store } from './store.js';

// Calculate distance between two coordinates in kilometers (Haversine Formula)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest city from database based on Lat/Lng
export function findNearestCity(lat, lng) {
  if (!CITIES_DATABASE || CITIES_DATABASE.length === 0) return null;

  let nearest = CITIES_DATABASE[0];
  let minDistance = haversineDistance(lat, lng, nearest.lat, nearest.lng);

  for (let i = 1; i < CITIES_DATABASE.length; i++) {
    const dist = haversineDistance(lat, lng, CITIES_DATABASE[i].lat, CITIES_DATABASE[i].lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = CITIES_DATABASE[i];
    }
  }

  return { ...nearest, distanceKm: minDistance };
}

// Get current device position using browser Geolocation API
export function getCurrentDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Fitur Geolocation GPS tidak didukung oleh browser Anda.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        const nearest = findNearestCity(lat, lng);

        resolve({
          lat,
          lng,
          nearestCity: nearest,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let msg = 'Gagal mengambil lokasi GPS.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Izin akses lokasi GPS ditolak oleh pengguna.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Sinyal lokasi GPS tidak tersedia saat ini.';
            break;
          case error.TIMEOUT:
            msg = 'Waktu permintaan lokasi GPS habis (timeout).';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

// Auto update store with current GPS position
export async function updateStoreWithGPSLocation() {
  const loc = await getCurrentDeviceLocation();
  Store.saveSettings({
    customLat: loc.lat,
    customLng: loc.lng,
    cityId: loc.nearestCity ? loc.nearestCity.id : 'custom',
    useGPS: true,
    locationName: `GPS (${loc.lat.toFixed(2)}°, ${loc.lng.toFixed(2)}°)`
  });
  return loc;
}
