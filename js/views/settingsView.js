/* Settings View Module with Cool Theme Preset Selector */
import { CITIES_DATABASE } from '../cityData.js';
import { Store } from '../store.js';

export function renderSettingsView(container, onSettingsChange) {
  const settings = Store.getSettings();

  const cityOptions = CITIES_DATABASE.map(c => `
    <option value="${c.id}" ${settings.cityId === c.id ? 'selected' : ''}>
      ${c.name} (${c.lat.toFixed(2)}°, ${c.lng.toFixed(2)}°)
    </option>
  `).join('');

  const activePreset = settings.themePreset || 'emerald';

  container.innerHTML = `
    <!-- COOL THEME PRESET SELECTION CARD -->
    <div class="card">
      <div class="section-header" style="margin-bottom: 8px;">
        <div class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
          Tema & Nuansa Warna
        </div>
      </div>
      <div class="section-subtitle" style="margin-bottom: 14px;">Pilih palet warna Islami modern favorit Anda</div>

      <div style="display: flex; flex-direction: column; gap: 10px;" id="theme-preset-options">
        ${renderThemePresetOption('emerald', '🌲 Emerald Zamrud', 'Hijau Zamrud & Emas Mewah (Klasik Islami)', '#059669', '#F59E0B', '#0F172A', activePreset === 'emerald')}
        ${renderThemePresetOption('sapphire', '🌌 Royal Sapphire', 'Biru Malam Sapphire & Emas Glow', '#2563EB', '#F59E0B', '#080C17', activePreset === 'sapphire')}
        ${renderThemePresetOption('gold', '👑 Midnight Gold', 'Obsidian Gelap & Emas Champagne', '#D97706', '#FCD34D', '#0A0A0C', activePreset === 'gold')}
        ${renderThemePresetOption('sunset', '🌅 Desert Sunset', 'Terracotta Red & Pasir Emas Warm', '#E11D48', '#F59E0B', '#120E10', activePreset === 'sunset')}
        ${renderThemePresetOption('sage', '🍃 Sage Harmony', 'Hijau Sage Soft & Earthy Warmth', '#15803D', '#84CC16', '#0F1410', activePreset === 'sage')}
      </div>
    </div>

    <!-- LOCATION SETTINGS CARD -->
    <div class="card">
      <div class="section-title" style="margin-bottom: 14px;">Lokasi & Koordinat</div>

      <div class="form-group">
        <label class="form-label">Pilih Kota / Kabupaten</label>
        <select class="form-select" id="setting-city-select">
          ${cityOptions}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Atau Koordinat GPS Kustom (Opsional)</label>
        <div style="display: flex; gap: 8px;">
          <input type="number" step="any" placeholder="Latitude (-6.20)" class="form-input" id="setting-lat-input" value="${settings.customLat !== null ? settings.customLat : ''}">
          <input type="number" step="any" placeholder="Longitude (106.84)" class="form-input" id="setting-lng-input" value="${settings.customLng !== null ? settings.customLng : ''}">
        </div>
      </div>
    </div>

    <!-- CALCULATION METHOD & TWEAKS -->
    <div class="card">
      <div class="section-title" style="margin-bottom: 14px;">Metode Perhitungan Shalat</div>

      <div class="form-group">
        <label class="form-label">Standar Perhitungan</label>
        <select class="form-select" id="setting-method-select">
          <option value="kemenag" ${settings.method === 'kemenag' ? 'selected' : ''}>Kemenag RI (Fajr 20°, Isha 18°)</option>
          <option value="mwl" ${settings.method === 'mwl' ? 'selected' : ''}>Muslim World League (Fajr 18°, Isha 17°)</option>
          <option value="isna" ${settings.method === 'isna' ? 'selected' : ''}>ISNA America (Fajr 15°, Isha 15°)</option>
          <option value="egypt" ${settings.method === 'egypt' ? 'selected' : ''}>Egyptian Authority (Fajr 19.5°, Isha 17.5°)</option>
        </select>
      </div>

      <div class="section-title" style="font-size: 0.95rem; margin-top: 16px; margin-bottom: 10px;">Penyesuaian Manual (Menit)</div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div>
          <label class="form-label" style="font-size: 0.75rem;">Subuh</label>
          <input type="number" class="form-input" id="adj-fajr" value="${settings.timeAdjustments.fajr || 0}">
        </div>
        <div>
          <label class="form-label" style="font-size: 0.75rem;">Dzuhur</label>
          <input type="number" class="form-input" id="adj-dhuhr" value="${settings.timeAdjustments.dhuhr || 0}">
        </div>
        <div>
          <label class="form-label" style="font-size: 0.75rem;">Ashar</label>
          <input type="number" class="form-input" id="adj-asr" value="${settings.timeAdjustments.asr || 0}">
        </div>
        <div>
          <label class="form-label" style="font-size: 0.75rem;">Maghrib</label>
          <input type="number" class="form-input" id="adj-maghrib" value="${settings.timeAdjustments.maghrib || 0}">
        </div>
        <div>
          <label class="form-label" style="font-size: 0.75rem;">Isya</label>
          <input type="number" class="form-input" id="adj-isha" value="${settings.timeAdjustments.isha || 0}">
        </div>
      </div>
    </div>

    <!-- PREFERENCES CARD -->
    <div class="card">
      <div class="section-title" style="margin-bottom: 14px;">Tampilan & Notifikasi</div>

      <label class="switch-label">
        <div>
          <div style="font-size: 0.9rem; font-weight: 600;">Dark Mode</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">Tampilan gelap tenang & hemat daya</div>
        </div>
        <input type="checkbox" class="switch-input" id="setting-theme-switch" ${settings.theme === 'dark' ? 'checked' : ''}>
        <div class="switch-slider"></div>
      </label>

      <label class="switch-label">
        <div>
          <div style="font-size: 0.9rem; font-weight: 600;">Notifikasi / Audio Adhan</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">Bunyi pengingat ketika masuk waktu shalat</div>
        </div>
        <input type="checkbox" class="switch-input" id="setting-audio-switch" ${settings.adhanAudioEnabled ? 'checked' : ''}>
        <div class="switch-slider"></div>
      </label>
    </div>

    <!-- DATA MANAGEMENT CARD -->
    <div class="card">
      <div class="section-title" style="margin-bottom: 14px;">Manajemen Data & Offline Backup</div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="btn-secondary" id="export-json-btn" style="justify-content: center;">
          📥 Backup Data ke File JSON
        </button>

        <label class="btn-secondary" style="justify-content: center; cursor: pointer;">
          📤 Restore Data dari File JSON
          <input type="file" id="import-json-file" accept=".json" style="display: none;">
        </label>

        <button class="btn-secondary" id="reset-all-data-btn" style="justify-content: center; color: #EF4444; border-color: rgba(239, 68, 68, 0.3);">
          ⚠️ Reset Semua Data LocalStorage
        </button>
      </div>
    </div>
  `;

  // Attach Theme Preset Card Handlers
  container.querySelectorAll('.theme-preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const preset = card.getAttribute('data-preset');
      const updated = Store.saveSettings({ themePreset: preset });
      document.documentElement.setAttribute('data-theme-preset', preset);
      renderSettingsView(container, onSettingsChange);
      if (onSettingsChange) onSettingsChange();
    });
  });

  // Attach Event Handlers
  const citySelect = container.querySelector('#setting-city-select');
  const latInput = container.querySelector('#setting-lat-input');
  const lngInput = container.querySelector('#setting-lng-input');
  const methodSelect = container.querySelector('#setting-method-select');
  const themeSwitch = container.querySelector('#setting-theme-switch');
  const audioSwitch = container.querySelector('#setting-audio-switch');

  const saveAllSettings = () => {
    const customLatVal = latInput.value !== '' ? parseFloat(latInput.value) : null;
    const customLngVal = lngInput.value !== '' ? parseFloat(lngInput.value) : null;

    const newSettings = Store.saveSettings({
      cityId: citySelect.value,
      customLat: customLatVal,
      customLng: customLngVal,
      method: methodSelect.value,
      theme: themeSwitch.checked ? 'dark' : 'light',
      adhanAudioEnabled: audioSwitch.checked,
      timeAdjustments: {
        fajr: parseInt(container.querySelector('#adj-fajr').value) || 0,
        dhuhr: parseInt(container.querySelector('#adj-dhuhr').value) || 0,
        asr: parseInt(container.querySelector('#adj-asr').value) || 0,
        maghrib: parseInt(container.querySelector('#adj-maghrib').value) || 0,
        isha: parseInt(container.querySelector('#adj-isha').value) || 0
      }
    });

    document.documentElement.setAttribute('data-theme', newSettings.theme);
    if (onSettingsChange) onSettingsChange();
  };

  citySelect.addEventListener('change', saveAllSettings);
  latInput.addEventListener('change', saveAllSettings);
  lngInput.addEventListener('change', saveAllSettings);
  methodSelect.addEventListener('change', saveAllSettings);
  themeSwitch.addEventListener('change', saveAllSettings);
  audioSwitch.addEventListener('change', saveAllSettings);

  ['adj-fajr', 'adj-dhuhr', 'adj-asr', 'adj-maghrib', 'adj-isha'].forEach(id => {
    container.querySelector(`#${id}`).addEventListener('change', saveAllSettings);
  });

  // Export JSON
  container.querySelector('#export-json-btn').addEventListener('click', () => {
    Store.exportDataJSON();
  });

  // Import JSON
  container.querySelector('#import-json-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const success = Store.importDataJSON(evt.target.result);
      if (success) {
        alert('Data berhasil di-restore!');
        window.location.reload();
      } else {
        alert('Gagal membaca file JSON backup.');
      }
    };
    reader.readAsText(file);
  });

  // Reset Data
  container.querySelector('#reset-all-data-btn').addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat dan pengaturan local storage?')) {
      Store.clearAllData();
      window.location.reload();
    }
  });
}

function renderThemePresetOption(id, title, desc, color1, color2, color3, isActive) {
  return `
    <div class="theme-preset-card" data-preset="${id}" style="
      background: var(--bg-surface);
      border: 2px solid ${isActive ? 'var(--primary-emerald)' : 'var(--border-light)'};
      border-radius: var(--radius-md);
      padding: 12px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      box-shadow: ${isActive ? '0 0 0 1px var(--primary-emerald)' : 'none'};
      transition: all 0.2s ease;
    ">
      <div>
        <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">${title} ${isActive ? '✓' : ''}</div>
        <div style="font-size: 0.76rem; color: var(--text-muted);">${desc}</div>
      </div>
      <div style="display: flex; gap: 4px; align-items: center;">
        <div style="width: 16px; height: 16px; border-radius: 50%; background: ${color1}; border: 1px solid rgba(255,255,255,0.3);"></div>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: ${color2}; border: 1px solid rgba(255,255,255,0.3);"></div>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: ${color3}; border: 1px solid rgba(255,255,255,0.3);"></div>
      </div>
    </div>
  `;
}
