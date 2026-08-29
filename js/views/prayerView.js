/* Prayer View Render & Qibla Compass Interactivity */
import { getCityById } from '../cityData.js';
import { calculatePrayerTimes } from '../prayerEngine.js';
import { calculateQiblaAngle, setupDeviceOrientationListener } from '../qiblaEngine.js';
import { Store } from '../store.js';

let cleanupOrientation = null;

export function renderPrayerView(container) {
  const settings = Store.getSettings();
  const city = getCityById(settings.cityId);
  const lat = settings.customLat !== null ? settings.customLat : city.lat;
  const lng = settings.customLng !== null ? settings.customLng : city.lng;

  const now = new Date();
  const todayTimes = calculatePrayerTimes(now, lat, lng, city.timezone, {}, settings.timeAdjustments);
  const qiblaAngle = calculateQiblaAngle(lat, lng);

  container.innerHTML = `
    <!-- Top Tab Toggle for Schedule vs Qibla -->
    <div style="display: flex; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 4px; margin-bottom: 20px;">
      <button id="tab-schedule-btn" style="flex: 1; padding: 8px; border: none; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; background: var(--primary-emerald); color: #FFFFFF; cursor: pointer;">Jadwal Shalat</button>
      <button id="tab-qibla-btn" style="flex: 1; padding: 8px; border: none; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; background: transparent; color: var(--text-muted); cursor: pointer;">Arah Qibla</button>
    </div>

    <!-- SCHEDULE SECTION -->
    <div id="section-schedule">
      <div class="card" style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-main);">${city.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Metode: Kemenag RI (Fajr 20°, Isha 18°)</div>
          </div>
          <button id="play-adhan-btn" class="btn-primary" style="padding: 6px 12px; font-size: 0.78rem;">
            🔊 Audio Adhan
          </button>
        </div>

        <!-- Schedule Items -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${renderScheduleRow('Imsak', todayTimes.imsak, false)}
          ${renderScheduleRow('Subuh', todayTimes.subuh, true)}
          ${renderScheduleRow('Syuruq / Terbit', todayTimes.terbit, false)}
          ${renderScheduleRow('Duha', todayTimes.duha, false)}
          ${renderScheduleRow('Dzuhur', todayTimes.dzuhur, true)}
          ${renderScheduleRow('Ashar', todayTimes.ashar, true)}
          ${renderScheduleRow('Maghrib', todayTimes.maghrib, true)}
          ${renderScheduleRow('Isya', todayTimes.isya, true)}
        </div>
      </div>

      <!-- Monthly Table Breakdown Card -->
      <div class="card">
        <div class="section-title" style="margin-bottom: 10px;">Jadwal Bulan Ini (${now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})</div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: center;">
            <thead>
              <tr style="background: var(--bg-app); color: var(--text-muted); border-bottom: 1px solid var(--border-light);">
                <th style="padding: 8px;">Tgl</th>
                <th style="padding: 8px;">Subuh</th>
                <th style="padding: 8px;">Dzuhur</th>
                <th style="padding: 8px;">Ashar</th>
                <th style="padding: 8px;">Maghrib</th>
                <th style="padding: 8px;">Isya</th>
              </tr>
            </thead>
            <tbody>
              ${renderMonthlyRows(now, lat, lng, city.timezone, settings.timeAdjustments)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- QIBLA COMPASS SECTION -->
    <div id="section-qibla" style="display: none; text-align: center;">
      <div class="card">
        <div class="section-title" style="justify-content: center; margin-bottom: 4px;">Arah Kiblat (${qiblaAngle}°)</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">
          Arah sudut dari ${city.name} ke Ka'bah Makkah Al-Mukarramah
        </div>

        <div class="compass-box">
          <div class="kaaba-icon">🕌</div>
          <div class="compass-dial" id="compass-dial" style="transform: rotate(${qiblaAngle}deg);">
            <div class="compass-needle" style="top: 40px; left: calc(50% - 3px);"></div>
          </div>
        </div>

        <div style="font-size: 0.85rem; font-weight: 600; color: var(--primary-emerald); margin-top: 12px;" id="compass-status-text">
          Putar perangkat Anda untuk menyesuaikan kompas.
        </div>
      </div>
    </div>
  `;

  // Tab Toggle Logic
  const scheduleBtn = container.querySelector('#tab-schedule-btn');
  const qiblaBtn = container.querySelector('#tab-qibla-btn');
  const scheduleSec = container.querySelector('#section-schedule');
  const qiblaSec = container.querySelector('#section-qibla');

  scheduleBtn.addEventListener('click', () => {
    scheduleBtn.style.background = 'var(--primary-emerald)';
    scheduleBtn.style.color = '#FFFFFF';
    qiblaBtn.style.background = 'transparent';
    qiblaBtn.style.color = 'var(--text-muted)';
    scheduleSec.style.display = 'block';
    qiblaSec.style.display = 'none';
  });

  qiblaBtn.addEventListener('click', () => {
    qiblaBtn.style.background = 'var(--primary-emerald)';
    qiblaBtn.style.color = '#FFFFFF';
    scheduleBtn.style.background = 'transparent';
    scheduleBtn.style.color = 'var(--text-muted)';
    scheduleSec.style.display = 'none';
    qiblaSec.style.display = 'block';

    // Start Device Orientation Listener if available
    const dial = document.getElementById('compass-dial');
    if (cleanupOrientation) cleanupOrientation();
    cleanupOrientation = setupDeviceOrientationListener((heading) => {
      if (dial) {
        const adjustedRotation = qiblaAngle - heading;
        dial.style.transform = `rotate(${adjustedRotation}deg)`;
      }
    });
  });

  // Audio Adhan Preview
  const playBtn = container.querySelector('#play-adhan-btn');
  playBtn.addEventListener('click', () => {
    playAdhanAudioPreview();
  });
}

function renderScheduleRow(label, timeStr, isMain) {
  return `
    <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: ${isMain ? 'var(--bg-surface)' : 'var(--bg-app)'}; border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: ${isMain ? '700' : '500'};">
      <span>${label}</span>
      <span style="color: ${isMain ? 'var(--primary-emerald)' : 'var(--text-muted)'};">${timeStr}</span>
    </div>
  `;
}

function renderMonthlyRows(currentDate, lat, lng, timezone, adjustments) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = currentDate.getDate();

  let html = '';
  for (let d = 1; d <= daysInMonth; d++) {
    const iterDate = new Date(year, month, d);
    const times = calculatePrayerTimes(iterDate, lat, lng, timezone, {}, adjustments);
    const isToday = d === todayDate;

    html += `
      <tr style="border-bottom: 1px solid var(--border-light); ${isToday ? 'background: var(--primary-emerald-bg); font-weight: 700;' : ''}">
        <td style="padding: 6px;">${d}</td>
        <td style="padding: 6px;">${times.subuh}</td>
        <td style="padding: 6px;">${times.dzuhur}</td>
        <td style="padding: 6px;">${times.ashar}</td>
        <td style="padding: 6px;">${times.maghrib}</td>
        <td style="padding: 6px;">${times.isya}</td>
      </tr>
    `;
  }
  return html;
}

function playAdhanAudioPreview() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Play a tranquil melodic chime tone simulating Adhan call melody offline
    const notes = [329.63, 392.00, 440.00, 523.25, 440.00, 392.00];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.4);

      gain.gain.setValueAtTime(0.2, now + idx * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.4 + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.4);
      osc.stop(now + idx * 0.4 + 0.38);
    });
  } catch (e) {
    console.error(e);
  }
}
