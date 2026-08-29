/* Radio Sunnah Audio Stream Engine with Buffering Timeout & Cache-Busting */
import { RADIO_STATIONS, getStationById } from './radioData.js';

let audioPlayer = null;
let currentStation = RADIO_STATIONS[0];
let currentUrlIndex = 0;
let isPlaying = false;
let isBuffering = false;
let statusMessage = 'OFFLINE';
let bufferTimeoutTimer = null;
let eventListeners = [];

export function getAudioPlayer() {
  if (!audioPlayer) {
    audioPlayer = new Audio();
    audioPlayer.preload = 'none';

    audioPlayer.addEventListener('playing', () => {
      clearBufferTimeout();
      isPlaying = true;
      isBuffering = false;
      statusMessage = 'LIVE';
      notifyListeners('statusChange');
    });

    audioPlayer.addEventListener('waiting', () => {
      isBuffering = true;
      statusMessage = 'MENYAMBUNGKAN...';
      notifyListeners('statusChange');
      startBufferTimeout();
    });

    audioPlayer.addEventListener('canplay', () => {
      clearBufferTimeout();
      if (isBuffering && !isPlaying) {
        audioPlayer.play().catch(e => console.warn(e));
      }
    });

    audioPlayer.addEventListener('pause', () => {
      clearBufferTimeout();
      isPlaying = false;
      isBuffering = false;
      statusMessage = 'OFFLINE';
      notifyListeners('statusChange');
    });

    audioPlayer.addEventListener('error', (e) => {
      clearBufferTimeout();
      console.warn('[Radio Engine] Stream error on URL index:', currentUrlIndex, e);
      tryNextFallbackUrl();
    });
  }
  return audioPlayer;
}

function startBufferTimeout() {
  clearBufferTimeout();
  // If buffering takes longer than 6 seconds, attempt next fallback URL
  bufferTimeoutTimer = setTimeout(() => {
    if (isBuffering && !isPlaying) {
      console.warn('[Radio Engine] Buffering timeout reached (6s), trying next fallback URL...');
      tryNextFallbackUrl();
    }
  }, 6000);
}

function clearBufferTimeout() {
  if (bufferTimeoutTimer) {
    clearTimeout(bufferTimeoutTimer);
    bufferTimeoutTimer = null;
  }
}

function getFormattedUrl(rawUrl) {
  const separator = rawUrl.includes('?') ? '&' : '?';
  return `${rawUrl}${separator}nocache=${Date.now()}`;
}

function tryNextFallbackUrl() {
  currentUrlIndex++;
  const urls = currentStation.urls || [currentStation.streamUrl];

  if (currentUrlIndex < urls.length) {
    const rawUrl = urls[currentUrlIndex];
    const formattedUrl = getFormattedUrl(rawUrl);
    console.log('[Radio Engine] Trying fallback stream URL index', currentUrlIndex, formattedUrl);

    statusMessage = `SERVER ${currentUrlIndex + 1}...`;
    notifyListeners('statusChange');

    const player = getAudioPlayer();
    player.src = formattedUrl;
    startBufferTimeout();
    player.play().catch(err => {
      console.warn('[Radio Engine] Fallback play failed:', err);
      tryNextFallbackUrl();
    });
  } else {
    clearBufferTimeout();
    isPlaying = false;
    isBuffering = false;
    statusMessage = 'STREAM OFFLINE';
    notifyListeners('error', 'Stasiun radio sedang offline / diblokir koneksi. Coba stasiun lain.');
  }
}

export function playRadio(stationId) {
  const player = getAudioPlayer();

  if (stationId && stationId !== currentStation.id) {
    currentStation = getStationById(stationId);
    currentUrlIndex = 0;
  }

  const urls = currentStation.urls || [currentStation.streamUrl];
  const rawUrl = urls[currentUrlIndex] || urls[0];
  const formattedUrl = getFormattedUrl(rawUrl);

  player.src = formattedUrl;
  isBuffering = true;
  isPlaying = false;
  statusMessage = 'MENYAMBUNGKAN...';
  notifyListeners('statusChange');
  startBufferTimeout();

  player.play().then(() => {
    // Playing event listener will handle resetting flags
  }).catch(err => {
    console.warn('[Radio Engine] Primary play failed:', err);
    tryNextFallbackUrl();
  });
}

export function pauseRadio() {
  clearBufferTimeout();
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.src = ''; // Clear source to stop downloading stream in background
    isPlaying = false;
    isBuffering = false;
    statusMessage = 'OFFLINE';
    notifyListeners('statusChange');
  }
}

export function toggleRadio(stationId) {
  if (isPlaying && (!stationId || stationId === currentStation.id)) {
    pauseRadio();
  } else {
    playRadio(stationId || currentStation.id);
  }
}

export function setRadioVolume(volumeFloat) {
  const player = getAudioPlayer();
  player.volume = Math.max(0, Math.min(1, volumeFloat));
  notifyListeners('volumeChange', player.volume);
}

export function getCurrentRadioState() {
  return {
    station: currentStation,
    isPlaying,
    isBuffering,
    statusMessage,
    currentUrl: currentStation.urls ? currentStation.urls[currentUrlIndex] : '',
    volume: audioPlayer ? audioPlayer.volume : 1.0
  };
}

export function subscribeRadioEvents(callback) {
  eventListeners.push(callback);
  return () => {
    eventListeners = eventListeners.filter(cb => cb !== callback);
  };
}

function notifyListeners(eventType, payload) {
  eventListeners.forEach(cb => {
    try {
      cb(eventType, payload, getCurrentRadioState());
    } catch (e) {
      console.error(e);
    }
  });
}
