/* Home View Render & Interactivity Controller */
import { getCityById } from '../cityData.js';
import { calculatePrayerTimes, getNextPrayerInfo, getHijriDateString } from '../prayerEngine.js';
import { Store, getTodayKey } from '../store.js';

let countdownTimerInterval = null;

export function renderHomeView(container, navigateTo) {
  const settings = Store.getSettings();
  const city = getCityById(settings.cityId);
  const todayKey = getTodayKey();
  const dailyLog = Store.getDailyLog(todayKey);

  const lat = settings.customLat !== null ? settings.customLat : city.lat;
  const lng = settings.customLng !== null ? settings.customLng : city.lng;

  const now = new Date();
  const prayerTimes = calculatePrayerTimes(now, lat, lng, city.timezone, {}, settings.timeAdjustments);
  const nextInfo = getNextPrayerInfo(prayerTimes, now);

  const totalTasks = 9; // 5 prayers + 4 target ibadah
  let completedCount = 0;
  Object.values(dailyLog.prayers).forEach(v => { if (v) completedCount++; });
  Object.values(dailyLog.targets).forEach(v => { if (v) completedCount++; });
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  // Formatting dates
  const gregorianDateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijriDateStr = getHijriDateString(now);

  container.innerHTML = `
    <!-- Hero Next Prayer Countdown Card -->
    <div class="hero-card">
      <div class="hero-top-info">
        <div class="hero-location-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${settings.customLat ? 'GPS Kustom' : city.name}</span>
        </div>
        <div class="hero-date-text">
          <div>${gregorianDateStr}</div>
          <div style="color: var(--accent-gold-light); font-weight: 600;">${hijriDateStr}</div>
        </div>
      </div>

      <div class="hero-next-prayer-title">Waktu Shalat Berikutnya</div>
      <div class="hero-prayer-name">
        <span>${nextInfo.next.name}</span>
        <span class="hero-prayer-time">${nextInfo.next.timeStr}</span>
      </div>

      <div class="hero-countdown-box">
        <span class="countdown-label">Menuju Adhan</span>
        <span class="countdown-timer" id="hero-timer">00:00:00</span>
      </div>
    </div>

    <!-- Daily Progress Overview -->
    <div class="progress-card">
      <div class="progress-ring-box">
        <svg viewBox="0 0 100 100">
          <circle class="progress-ring-bg" cx="50" cy="50" r="40"/>
          <circle class="progress-ring-fill" id="home-progress-ring" cx="50" cy="50" r="40"/>
        </svg>
        <div class="progress-percentage">${progressPercent}%</div>
      </div>
      <div class="progress-details">
        <div class="progress-details-title">Progres Ibadah Hari Ini</div>
        <div class="progress-details-desc">${completedCount} dari ${totalTasks} ibadah (Shalat 5 waktu & target harian) telah dilaksanakan.</div>
      </div>
    </div>

    <!-- 5 Time Obligatory Prayer Checklist -->
    <div class="section-header">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Shalat 5 Waktu
      </div>
      <div class="section-subtitle">Tandai yang telah ditunaikan</div>
    </div>

    <div class="prayer-checklist">
      ${renderPrayerItem('subuh', 'Subuh', prayerTimes.subuh, dailyLog.prayers.subuh, nextInfo.next.key === 'subuh')}
      ${renderPrayerItem('dzuhur', 'Dzuhur', prayerTimes.dzuhur, dailyLog.prayers.dzuhur, nextInfo.next.key === 'dzuhur')}
      ${renderPrayerItem('ashar', 'Ashar', prayerTimes.ashar, dailyLog.prayers.ashar, nextInfo.next.key === 'ashar')}
      ${renderPrayerItem('maghrib', 'Maghrib', prayerTimes.maghrib, dailyLog.prayers.maghrib, nextInfo.next.key === 'maghrib')}
      ${renderPrayerItem('isya', 'Isya', prayerTimes.isya, dailyLog.prayers.isya, nextInfo.next.key === 'isya')}
    </div>

    <!-- Daily Worship Targets Grid -->
    <div class="section-header">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        Target Ibadah Harian
      </div>
    </div>

    <div class="targets-grid">
      <div class="target-card" id="target-tilawah-card">
        <div class="target-top">
          <div class="target-icon">📖</div>
          <button class="check-btn ${dailyLog.targets.tilawah ? 'checked' : ''}" data-target="tilawah">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
        <div>
          <div class="target-title">Tilawah Al-Qur'an</div>
          <div class="target-desc">Target minimal 1 Lembar / Juz</div>
        </div>
      </div>

      <div class="target-card" id="target-dzikir-pagi-card">
        <div class="target-top">
          <div class="target-icon">🌅</div>
          <button class="check-btn ${dailyLog.targets.dzikir_pagi ? 'checked' : ''}" data-target="dzikir_pagi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
        <div>
          <div class="target-title">Dzikir Pagi</div>
          <div class="target-desc">Setelah Subuh s.d. Syuruq</div>
        </div>
      </div>

      <div class="target-card" id="target-dzikir-petang-card">
        <div class="target-top">
          <div class="target-icon">🌆</div>
          <button class="check-btn ${dailyLog.targets.dzikir_petang ? 'checked' : ''}" data-target="dzikir_petang">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
        <div>
          <div class="target-title">Dzikir Petang</div>
          <div class="target-desc">Setelah Ashar s.d. Maghrib</div>
        </div>
      </div>

      <div class="target-card" id="target-murajaah-card">
        <div class="target-top">
          <div class="target-icon">📿</div>
          <button class="check-btn ${dailyLog.targets.murajaah ? 'checked' : ''}" data-target="murajaah">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
        <div>
          <div class="target-title">Murajaah & Witir</div>
          <div class="target-desc">Pengulangan hafalan / Witir</div>
        </div>
      </div>
    </div>
  `;

  // Update ring stroke dashoffset
  const ringFill = document.getElementById('home-progress-ring');
  if (ringFill) {
    const circumference = 2 * Math.PI * 40; // ~251.2
    const offset = circumference - (progressPercent / 100) * circumference;
    ringFill.style.strokeDashoffset = offset;
  }

  // Start live ticking countdown timer
  startCountdownTimer(nextInfo.remainingMs);

  // Attach Checkbox Handlers
  container.querySelectorAll('.check-btn[data-prayer]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prayerKey = btn.getAttribute('data-prayer');
      const isChecked = btn.classList.contains('checked');
      const updatedLog = Store.updateDailyLog(todayKey, 'prayers', prayerKey, !isChecked);
      renderHomeView(container, navigateTo);
    });
  });

  container.querySelectorAll('.check-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetKey = btn.getAttribute('data-target');
      const isChecked = btn.classList.contains('checked');
      Store.updateDailyLog(todayKey, 'targets', targetKey, !isChecked);
      renderHomeView(container, navigateTo);
    });
  });
}

function renderPrayerItem(key, name, timeStr, isCompleted, isNext) {
  return `
    <div class="prayer-item-card ${isNext ? 'next' : ''} ${isCompleted ? 'completed' : ''}">
      <div class="prayer-item-left">
        <div class="prayer-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
        </div>
        <div>
          <div class="prayer-info-name">${name}</div>
          <div class="prayer-info-time">${timeStr} WIB</div>
        </div>
      </div>
      <button class="check-btn ${isCompleted ? 'checked' : ''}" data-prayer="${key}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
    </div>
  `;
}

function startCountdownTimer(initialMs) {
  if (countdownTimerInterval) clearInterval(countdownTimerInterval);
  let remainingSec = Math.floor(initialMs / 1000);

  const updateDisplay = () => {
    const timerElem = document.getElementById('hero-timer');
    if (!timerElem) return;

    if (remainingSec <= 0) {
      timerElem.textContent = "00:00:00";
      clearInterval(countdownTimerInterval);
      return;
    }

    const h = Math.floor(remainingSec / 3600);
    const m = Math.floor((remainingSec % 3600) / 60);
    const s = remainingSec % 60;

    timerElem.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    remainingSec--;
  };

  updateDisplay();
  countdownTimerInterval = setInterval(updateDisplay, 1000);
}
