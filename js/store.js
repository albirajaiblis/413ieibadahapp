/* LocalStorage Persistence Manager & Store */

const SETTINGS_KEY = 'prayer_app_settings';
const LOGS_KEY = 'prayer_app_logs';
const TASBIH_KEY = 'prayer_app_tasbih';

const DEFAULT_SETTINGS = {
  cityId: 'jakarta',
  customLat: null,
  customLng: null,
  useGPS: false,
  locationName: null,
  method: 'kemenag', // kemenag, mwl, isna, egypt
  adhanAudioEnabled: true,
  adhanSound: 'makkah',
  theme: 'dark', // 'dark', 'light'
  themePreset: 'emerald', // 'emerald', 'sapphire', 'gold', 'sunset', 'sage'
  timeAdjustments: {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  }
};

export function getTodayKey(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const Store = {
  getSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(newSettings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getDailyLog(dateKey = getTodayKey()) {
    try {
      const allLogs = JSON.parse(localStorage.getItem(LOGS_KEY) || '{}');
      return allLogs[dateKey] || {
        prayers: { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false },
        sunnah: { tahajjud: false, duha: false, rawatib: false, witir: false },
        targets: { tilawah: false, dzikir_pagi: false, dzikir_petang: false, murajaah: false },
        tilawahProgress: { surah: '', juz: 1, page: 0 },
        tasbihTotalCount: 0
      };
    } catch (e) {
      return {
        prayers: { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false },
        sunnah: { tahajjud: false, duha: false, rawatib: false, witir: false },
        targets: { tilawah: false, dzikir_pagi: false, dzikir_petang: false, murajaah: false },
        tilawahProgress: { surah: '', juz: 1, page: 0 },
        tasbihTotalCount: 0
      };
    }
  },

  updateDailyLog(dateKey, category, key, value) {
    try {
      const allLogs = JSON.parse(localStorage.getItem(LOGS_KEY) || '{}');
      if (!allLogs[dateKey]) {
        allLogs[dateKey] = this.getDailyLog(dateKey);
      }
      if (category && key) {
        if (!allLogs[dateKey][category]) allLogs[dateKey][category] = {};
        allLogs[dateKey][category][key] = value;
      }
      localStorage.setItem(LOGS_KEY, JSON.stringify(allLogs));
      return allLogs[dateKey];
    } catch (e) {
      console.error('Failed to update daily log:', e);
    }
  },

  getAllLogs() {
    try {
      return JSON.parse(localStorage.getItem(LOGS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  },

  getTasbihState() {
    try {
      return JSON.parse(localStorage.getItem(TASBIH_KEY) || '{"count": 0, "target": 33, "dhikr": "subhanallah"}');
    } catch (e) {
      return { count: 0, target: 33, dhikr: 'subhanallah' };
    }
  },

  saveTasbihState(state) {
    try {
      localStorage.setItem(TASBIH_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save tasbih state:', e);
    }
  },

  // Export all application data as JSON download
  exportDataJSON() {
    const data = {
      settings: this.getSettings(),
      logs: this.getAllLogs(),
      tasbih: this.getTasbihState(),
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PrayerApp_Backup_${getTodayKey()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Import JSON backup data
  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed.settings));
      if (parsed.logs) localStorage.setItem(LOGS_KEY, JSON.stringify(parsed.logs));
      if (parsed.tasbih) localStorage.setItem(TASBIH_KEY, JSON.stringify(parsed.tasbih));
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  },

  clearAllData() {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(LOGS_KEY);
    localStorage.removeItem(TASBIH_KEY);
  }
};
