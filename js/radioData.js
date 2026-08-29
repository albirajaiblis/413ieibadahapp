/* Verified High-Availability Sunnah Radio Streams Database */

export const RADIO_STATIONS = [
  {
    id: 'rodja',
    name: 'Radio Rodja 756 AM',
    tagline: 'Menebar Cahaya Sunnah',
    location: 'Cileungsi, Bogor',
    frequency: '756 AM / Online',
    urls: [
      'https://radio.radiorodja.com/stream',
      'https://live.radiorodja.com/',
      'https://radiorodja.radioca.st/stream',
      'http://stream.radiorodja.com:8000/live'
    ],
    webUrl: 'https://radiorodja.com',
    icon: '📻',
    color: '#059669'
  },
  {
    id: 'radiomuslim',
    name: 'Radio Muslim Jogja',
    tagline: 'Memurnikan Aqidah, Menebar Sunnah',
    location: 'Yogyakarta',
    frequency: '1467 AM / Online',
    urls: [
      'https://stream.radiomuslim.com/stream',
      'https://radiomuslim.com/stream.mp3',
      'http://stream.radiomuslim.com:8000/radiomuslim'
    ],
    webUrl: 'https://radiomuslim.com',
    icon: '🎙️',
    color: '#2563EB'
  },
  {
    id: 'quran_live',
    name: 'Radio Tilawah Al-Qur\'an 24Jam',
    tagline: 'Lantunan Ayat Suci Al-Qur\'an Nonstop',
    location: 'Makkah / Madinah',
    frequency: 'Online Stream',
    urls: [
      'https://stream.zeno.fm/f3wvbb751g8uv',
      'https://qurango.net/radio/tarfeeh',
      'https://server8.qurango.net/radio/mohammad_al_tablaway'
    ],
    webUrl: 'https://qurango.net',
    icon: '📖',
    color: '#D97706'
  },
  {
    id: 'muadz',
    name: 'Radio Muadz FM',
    tagline: 'Media Dakwah & Edukasi Islami',
    location: 'Kendari, Sulawesi Tenggara',
    frequency: '94.3 FM / Online',
    urls: [
      'https://stream.radiomuadz.com/stream',
      'http://stream.radiomuadz.com:8000/stream'
    ],
    webUrl: 'https://radiomuadz.com',
    icon: '📡',
    color: '#D97706'
  },
  {
    id: 'hangfm',
    name: 'Radio Hang FM',
    tagline: 'Media Dakwah Sunnah Kepri',
    location: 'Batam, Kepulauan Riau',
    frequency: '106.0 FM / Online',
    urls: [
      'https://stream.hangfm.co.id/live',
      'http://hangfm.ddns.net:8000/stream'
    ],
    webUrl: 'https://hangfm.co.id',
    icon: '🔊',
    color: '#E11D48'
  },
  {
    id: 'bassfm',
    name: 'Radio Bass FM',
    tagline: 'Menebar Senyum Menyapa Hati',
    location: 'Salatiga, Jawa Tengah',
    frequency: '93.2 FM / Online',
    urls: [
      'https://stream.bassfm.id/stream',
      'http://stream.bassfm.id:8000/stream'
    ],
    webUrl: 'https://bassfm.id',
    icon: '🎧',
    color: '#7C3AED'
  }
];

export function getStationById(id) {
  return RADIO_STATIONS.find(s => s.id === id) || RADIO_STATIONS[0];
}
