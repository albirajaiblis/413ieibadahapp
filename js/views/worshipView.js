/* Worship Tracker, Digital Tasbih, Radio Sunnah & Dzikir Reader View */
import { Store, getTodayKey } from '../store.js';
import { playTasbihClickSound, playTargetReachedSound, triggerHapticFeedback } from '../tasbihEngine.js';
import { DZIKIR_PAGI, DZIKIR_PETANG, SURAH_LIST } from '../dzikirData.js';
import { RADIO_STATIONS } from '../radioData.js';
import { toggleRadio, setRadioVolume, getCurrentRadioState, subscribeRadioEvents, playRadio } from '../radioEngine.js';

let radioUnsubscribe = null;

export function renderWorshipView(container, navigateTo) {
  const todayKey = getTodayKey();
  const dailyLog = Store.getDailyLog(todayKey);
  const tasbihState = Store.getTasbihState();
  const radioState = getCurrentRadioState();

  container.innerHTML = `
    <!-- GAME KUIS ISLAMI BANNER CARD -->
    <div class="card" id="quiz-banner-card" style="
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(5, 150, 105, 0.15));
      border: 1px solid var(--accent-gold-light);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      margin-bottom: 14px;
      cursor: pointer;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 2rem;">🎮</div>
        <div>
          <div style="font-weight: 800; font-size: 1rem; color: var(--accent-gold-light);">Game Kuis Islami</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Tebak Ayat, Tebak Surah, & Sambung Ayat</div>
        </div>
      </div>
      <button class="btn-primary" style="padding: 8px 14px; font-size: 0.82rem; font-weight: 700; white-space: nowrap;">
        Mainkan ➔
      </button>
    </div>

    <!-- RADIO SUNNAH STREAMING WIDGET -->
    <div class="radio-card">
      <div class="radio-top-header">
        <div class="section-title" style="font-size: 0.95rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2"/></svg>
          Radio Sunnah & Tilawah Live
        </div>
        <div class="radio-live-badge ${radioState.isPlaying ? 'playing' : 'idle'}" id="radio-live-badge">
          ${radioState.isPlaying ? '<span class="radio-live-dot"></span> LIVE' : radioState.statusMessage}
        </div>
      </div>

      <div class="radio-station-display">
        <div class="radio-icon-box" id="radio-icon-box">${radioState.station.icon}</div>
        <div style="flex: 1;">
          <div class="radio-station-title" id="radio-title">${radioState.station.name}</div>
          <div class="radio-station-subtitle" id="radio-tagline">${radioState.station.tagline}</div>
          <div class="radio-station-location" id="radio-location">${radioState.station.location} (${radioState.station.frequency})</div>
        </div>
        <div class="radio-wave-box ${radioState.isPlaying ? 'active' : ''}" id="radio-wave-box">
          <div class="radio-wave-bar"></div>
          <div class="radio-wave-bar"></div>
          <div class="radio-wave-bar"></div>
          <div class="radio-wave-bar"></div>
        </div>
      </div>

      <div class="radio-controls-row">
        <button class="radio-play-btn" id="radio-play-btn" title="Putar / Hentikan Siaran Radio">
          ${radioState.isPlaying ? `
            <svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ` : `
            <svg viewBox="0 0 24 24" style="margin-left: 2px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          `}
        </button>

        <div class="radio-volume-box">
          <span style="font-size: 0.85rem; color: var(--text-muted);">🔊</span>
          <input type="range" class="radio-volume-slider" id="radio-volume-slider" min="0" max="1" step="0.05" value="${radioState.volume}">
        </div>

        <a id="radio-direct-stream" href="${radioState.station.urls[0]}" target="_blank" rel="noopener" style="font-size: 0.76rem; font-weight: 600; color: var(--primary-emerald); text-decoration: none; padding: 6px 10px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); background: var(--bg-app); display: flex; align-items: center; gap: 4px;" title="Putar langsung di tab browser baru (100% Bebas Blokir Browser)">
          ↗️ Putar di Tab
        </a>
      </div>

      <div class="radio-stations-list" id="radio-stations-list">
        ${RADIO_STATIONS.map(s => `
          <button class="radio-station-pill ${radioState.station.id === s.id ? 'active' : ''}" data-station="${s.id}">
            <span>${s.icon}</span>
            <span>${s.name.split(' ')[0]} ${s.name.split(' ')[1] || ''}</span>
          </button>
        `).join('')}
      </div>

      <!-- Informative Note for Mixed Content / Browser Restrictions -->
      <div style="margin-top: 12px; padding: 8px 12px; background: var(--bg-app); border-radius: var(--radius-sm); font-size: 0.72rem; color: var(--text-muted); line-height: 1.3;">
        💡 <strong>Catatan Siaran:</strong> Beberapa stasiun radio lokal menggunakan server HTTP unencrypted. Jika pemutar internal diblokir oleh keamanan browser (Buffering terus), klik tombol <strong>"↗️ Putar di Tab"</strong> untuk mendengarkan siaran langsung tanpa hambatan.
      </div>
    </div>

    <!-- DIGITAL TASBIH WIDGET -->
    <div class="tasbih-container">
      <div class="tasbih-preset-pill">
        <button class="preset-btn ${tasbihState.target === 33 ? 'active' : ''}" data-target="33">33 Kali</button>
        <button class="preset-btn ${tasbihState.target === 99 ? 'active' : ''}" data-target="99">99 Kali</button>
        <button class="preset-btn ${tasbihState.target === 1000 ? 'active' : ''}" data-target="1000">1000 Kali</button>
      </div>

      <div class="tasbih-dhikr-title" id="tasbih-title-display">
        ${getDhikrTitle(tasbihState.dhikr)}
      </div>
      <div class="tasbih-dhikr-arabic" id="tasbih-arabic-display">
        ${getDhikrArabic(tasbihState.dhikr)}
      </div>

      <button class="tasbih-counter-btn" id="tasbih-btn">
        <span class="tasbih-count-val" id="tasbih-count-val">${tasbihState.count}</span>
        <span class="tasbih-target-val">/ ${tasbihState.target}</span>
      </button>

      <div class="tasbih-controls">
        <button class="btn-secondary" id="tasbih-reset-btn">🔄 Reset</button>
        <button class="btn-secondary" id="tasbih-switch-dhikr-btn">🔀 Ganti Dzikir</button>
      </div>
    </div>

    <!-- SUNNAH PRAYER TRACKER -->
    <div class="section-header">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
        Shalat Sunnah & Qiyam
      </div>
    </div>

    <div class="prayer-checklist">
      ${renderSunnahItem('tahajjud', 'Shalat Tahajjud / Lail', '2-8 Rakaat di sepertiga malam', dailyLog.sunnah.tahajjud)}
      ${renderSunnahItem('duha', 'Shalat Duha', '2-8 Rakaat pagi hari', dailyLog.sunnah.duha)}
      ${renderSunnahItem('rawatib', 'Rawatib Qabliyyah & Ba\'diyyah', 'Shalat sunnah pengiring wajib', dailyLog.sunnah.rawatib)}
      ${renderSunnahItem('witir', 'Shalat Witir', '1-3 Rakaat penutup malam', dailyLog.sunnah.witir)}
    </div>

    <!-- TILAWAH & DZIKIR CARDS -->
    <div class="section-header">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Al-Qur'an & Dzikir Harian
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
      <div class="card" id="open-dzikir-pagi-btn" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.6rem;">🌅</div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">Baca Dzikir Pagi</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Teks lengkap, latin & terjemahan</div>
          </div>
        </div>
        <span style="color: var(--primary-emerald); font-weight: 700;">Buka &rarr;</span>
      </div>

      <div class="card" id="open-dzikir-petang-btn" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.6rem;">🌆</div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">Baca Dzikir Petang</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Teks lengkap, latin & terjemahan</div>
          </div>
        </div>
        <span style="color: var(--primary-emerald); font-weight: 700;">Buka &rarr;</span>
      </div>

      <div class="card" id="open-tilawah-modal-btn" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.6rem;">📖</div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">Catatan Progress Tilawah</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">
              ${dailyLog.tilawahProgress.surah ? `Terakhir: ${dailyLog.tilawahProgress.surah} (Juz ${dailyLog.tilawahProgress.juz})` : 'Catat Surah, Juz & Halaman'}
            </div>
          </div>
        </div>
        <span style="color: var(--primary-emerald); font-weight: 700;">Edit &rarr;</span>
      </div>
    </div>
  `;

  // QUIZ BANNER HANDLER
  const quizBanner = container.querySelector('#quiz-banner-card');
  if (quizBanner && navigateTo) {
    quizBanner.addEventListener('click', () => {
      navigateTo('quiz');
    });
  }

  // RADIO SUNNAH HANDLERS
  const radioPlayBtn = container.querySelector('#radio-play-btn');
  const radioVolumeSlider = container.querySelector('#radio-volume-slider');
  const stationPills = container.querySelectorAll('.radio-station-pill');

  radioPlayBtn.addEventListener('click', () => {
    toggleRadio();
  });

  radioVolumeSlider.addEventListener('input', (e) => {
    setRadioVolume(parseFloat(e.target.value));
  });

  stationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const stationId = pill.getAttribute('data-station');
      playRadio(stationId);
    });
  });

  // Subscribe to Radio Engine Events for Live UI Updates
  if (radioUnsubscribe) radioUnsubscribe();
  radioUnsubscribe = subscribeRadioEvents((eventType, payload, state) => {
    const badge = container.querySelector('#radio-live-badge');
    const playBtn = container.querySelector('#radio-play-btn');
    const waveBox = container.querySelector('#radio-wave-box');
    const title = container.querySelector('#radio-title');
    const tagline = container.querySelector('#radio-tagline');
    const location = container.querySelector('#radio-location');
    const iconBox = container.querySelector('#radio-icon-box');
    const directStream = container.querySelector('#radio-direct-stream');

    if (state) {
      if (title) title.textContent = state.station.name;
      if (tagline) tagline.textContent = state.station.tagline;
      if (location) location.textContent = `${state.station.location} (${state.station.frequency})`;
      if (iconBox) iconBox.textContent = state.station.icon;
      if (directStream) directStream.href = state.station.urls[0];

      if (badge) {
        if (state.isBuffering) {
          badge.className = 'radio-live-badge playing';
          badge.innerHTML = `🔄 ${state.statusMessage}`;
        } else if (state.isPlaying) {
          badge.className = 'radio-live-badge playing';
          badge.innerHTML = '<span class="radio-live-dot"></span> LIVE';
        } else {
          badge.className = 'radio-live-badge idle';
          badge.innerHTML = state.statusMessage || 'OFFLINE';
        }
      }

      if (playBtn) {
        playBtn.innerHTML = state.isPlaying ? `
          <svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        ` : `
          <svg viewBox="0 0 24 24" style="margin-left: 2px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        `;
      }

      if (waveBox) {
        if (state.isPlaying && !state.isBuffering) waveBox.classList.add('active');
        else waveBox.classList.remove('active');
      }

      // Update pills active state
      stationPills.forEach(p => {
        if (p.getAttribute('data-station') === state.station.id) p.classList.add('active');
        else p.classList.remove('active');
      });
    }
  });

  // TASBIH LOGIC
  const tasbihBtn = container.querySelector('#tasbih-btn');
  const countValElem = container.querySelector('#tasbih-count-val');
  const resetBtn = container.querySelector('#tasbih-reset-btn');
  const switchBtn = container.querySelector('#tasbih-switch-dhikr-btn');
  const presetBtns = container.querySelectorAll('.preset-btn');

  const updateTasbihUI = () => {
    countValElem.textContent = tasbihState.count;
    container.querySelector('#tasbih-title-display').textContent = getDhikrTitle(tasbihState.dhikr);
    container.querySelector('#tasbih-arabic-display').textContent = getDhikrArabic(tasbihState.dhikr);
  };

  tasbihBtn.addEventListener('click', () => {
    tasbihState.count++;
    playTasbihClickSound();
    triggerHapticFeedback(12);

    if (tasbihState.count >= tasbihState.target) {
      playTargetReachedSound();
      triggerHapticFeedback([40, 60, 40]);
    }

    Store.saveTasbihState(tasbihState);
    updateTasbihUI();
  });

  resetBtn.addEventListener('click', () => {
    tasbihState.count = 0;
    Store.saveTasbihState(tasbihState);
    updateTasbihUI();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tasbihState.target = parseInt(btn.getAttribute('data-target'));
      Store.saveTasbihState(tasbihState);
      renderWorshipView(container);
    });
  });

  switchBtn.addEventListener('click', () => {
    const options = ['subhanallah', 'alhamdulillah', 'allahwakbar', 'astaghfirullah'];
    const idx = options.indexOf(tasbihState.dhikr);
    tasbihState.dhikr = options[(idx + 1) % options.length];
    Store.saveTasbihState(tasbihState);
    updateTasbihUI();
  });

  // SUNNAH CHECKBOX HANDLER
  container.querySelectorAll('.check-btn[data-sunnah]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sunnahKey = btn.getAttribute('data-sunnah');
      const isChecked = btn.classList.contains('checked');
      Store.updateDailyLog(todayKey, 'sunnah', sunnahKey, !isChecked);
      renderWorshipView(container);
    });
  });

  // DZIKIR READER MODAL HANDLERS
  container.querySelector('#open-dzikir-pagi-btn').addEventListener('click', () => {
    openDzikirModal('Dzikir Pagi', DZIKIR_PAGI);
  });

  container.querySelector('#open-dzikir-petang-btn').addEventListener('click', () => {
    openDzikirModal('Dzikir Petang', DZIKIR_PETANG);
  });

  container.querySelector('#open-tilawah-modal-btn').addEventListener('click', () => {
    openTilawahModal(dailyLog.tilawahProgress, (newProgress) => {
      Store.updateDailyLog(todayKey, 'tilawahProgress', null, newProgress);
      Store.updateDailyLog(todayKey, 'targets', 'tilawah', true);
      renderWorshipView(container);
    });
  });
}

function renderSunnahItem(key, name, desc, isCompleted) {
  return `
    <div class="prayer-item-card ${isCompleted ? 'completed' : ''}">
      <div class="prayer-item-left">
        <div class="prayer-icon-box">✨</div>
        <div>
          <div class="prayer-info-name">${name}</div>
          <div class="prayer-info-time">${desc}</div>
        </div>
      </div>
      <button class="check-btn ${isCompleted ? 'checked' : ''}" data-sunnah="${key}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
    </div>
  `;
}

function getDhikrTitle(key) {
  switch (key) {
    case 'alhamdulillah': return 'Alhamdulillah';
    case 'allahwakbar': return 'Allahu Akbar';
    case 'astaghfirullah': return 'Astaghfirullah';
    default: return 'Subhanallah';
  }
}

function getDhikrArabic(key) {
  switch (key) {
    case 'alhamdulillah': return 'الْحَمْدُ لِلَّهِ';
    case 'allahwakbar': return 'اللَّهُ أَكْبَرُ';
    case 'astaghfirullah': return 'أَسْتَغْفِرُ اللَّهَ';
    default: return 'سُبْحَانَ اللَّهِ';
  }
}

function openDzikirModal(title, dzikirList) {
  const overlay = document.getElementById('global-modal-overlay');
  const modalBody = document.getElementById('global-modal-body');

  let itemsHtml = dzikirList.map(item => `
    <div class="dzikir-item-card">
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--primary-emerald);">${item.title}</div>
      <div class="dzikir-arabic">${item.arabic}</div>
      <div class="dzikir-latin">${item.latin}</div>
      <div class="dzikir-trans">${item.translation}</div>
      <div class="dzikir-footer">
        <span class="dzikir-repeat-badge">${item.repeat}</span>
      </div>
    </div>
  `).join('');

  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">${title}</div>
      <button class="modal-close-btn" id="modal-close-btn">✕</button>
    </div>
    <div>${itemsHtml}</div>
  `;

  overlay.classList.add('active');
  modalBody.querySelector('#modal-close-btn').addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

function openTilawahModal(currentProgress, onSave) {
  const overlay = document.getElementById('global-modal-overlay');
  const modalBody = document.getElementById('global-modal-body');

  const surahOptions = SURAH_LIST.map(s => `<option value="${s.name}" ${currentProgress.surah === s.name ? 'selected' : ''}>${s.id}. ${s.name}</option>`).join('');

  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">Update Catatan Tilawah</div>
      <button class="modal-close-btn" id="modal-close-btn">✕</button>
    </div>
    <div>
      <div class="form-group">
        <label class="form-label">Pilih Surah</label>
        <select class="form-select" id="tilawah-surah-select">
          ${surahOptions}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Juz (1 - 30)</label>
        <input type="number" min="1" max="30" class="form-input" id="tilawah-juz-input" value="${currentProgress.juz || 1}">
      </div>

      <div class="form-group">
        <label class="form-label">Halaman Terakhir / Halaman Dibaca Hari Ini</label>
        <input type="number" min="0" class="form-input" id="tilawah-page-input" value="${currentProgress.page || 0}">
      </div>

      <button class="btn-primary" id="save-tilawah-btn" style="width: 100%; justify-content: center; margin-top: 12px;">Simpan Progress Tilawah</button>
    </div>
  `;

  overlay.classList.add('active');

  modalBody.querySelector('#modal-close-btn').addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  modalBody.querySelector('#save-tilawah-btn').addEventListener('click', () => {
    const surah = modalBody.querySelector('#tilawah-surah-select').value;
    const juz = parseInt(modalBody.querySelector('#tilawah-juz-input').value) || 1;
    const page = parseInt(modalBody.querySelector('#tilawah-page-input').value) || 0;

    onSave({ surah, juz, page });
    overlay.classList.remove('active');
  });
}
