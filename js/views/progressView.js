/* Progress & Statistics View Module */
import { Store, getTodayKey } from '../store.js';

export function renderProgressView(container) {
  const allLogs = Store.getAllLogs();
  const todayKey = getTodayKey();

  // Compute 7 Days Activity Breakdown
  const daysData = [];
  const daysLabel = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  let streak = 0;
  let totalPrayersDone = 0;
  let totalTargetsDone = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const key = `${yyyy}-${mm}-${dd}`;
    const dayLog = allLogs[key];

    let prayersDone = 0;
    let targetsDone = 0;

    if (dayLog) {
      if (dayLog.prayers) Object.values(dayLog.prayers).forEach(v => { if (v) prayersDone++; });
      if (dayLog.targets) Object.values(dayLog.targets).forEach(v => { if (v) targetsDone++; });
    }

    const pct = Math.round(((prayersDone + targetsDone) / 9) * 100);
    daysData.push({
      dateStr: `${dd}/${mm}`,
      dayName: daysLabel[d.getDay()],
      prayersDone,
      targetsDone,
      pct,
      isToday: key === todayKey
    });

    totalPrayersDone += prayersDone;
    totalTargetsDone += targetsDone;

    if (pct >= 50) streak++; else if (i > 0) streak = 0;
  }

  container.innerHTML = `
    <!-- Streak Header Card -->
    <div class="card" style="background: linear-gradient(135deg, #1E293B, #0F172A); color: #FFFFFF; border-color: rgba(245, 158, 11, 0.3);">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 0.8rem; color: var(--accent-gold-light); font-weight: 600; text-transform: uppercase;">Istiqamah Streak</div>
          <div style="font-size: 2.2rem; font-weight: 800; color: #FFFFFF;">${streak} Hari 🔥</div>
          <div style="font-size: 0.78rem; opacity: 0.8; margin-top: 4px;">Pertahankan konsistensi ibadah harian Anda!</div>
        </div>
        <div style="font-size: 3.5rem;">🕌</div>
      </div>
    </div>

    <!-- 7-Day Activity Heatmap Chart Card -->
    <div class="card">
      <div class="section-title" style="margin-bottom: 14px;">Aktivitas 7 Hari Terakhir</div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; height: 140px; padding: 10px 0; border-bottom: 1px solid var(--border-light);">
        ${daysData.map(d => `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1;">
            <div style="font-size: 0.7rem; font-weight: 700; color: var(--primary-emerald);">${d.pct}%</div>
            <div style="width: 24px; height: 80px; background: var(--bg-app); border-radius: var(--radius-sm); position: relative; overflow: hidden; display: flex; align-items: flex-end;">
              <div style="width: 100%; height: ${d.pct}%; background: ${d.isToday ? 'var(--accent-gold)' : 'var(--primary-emerald)'}; border-radius: var(--radius-sm); transition: height 0.5s ease;"></div>
            </div>
            <div style="font-size: 0.72rem; color: ${d.isToday ? 'var(--primary-emerald)' : 'var(--text-muted)'}; font-weight: ${d.isToday ? '700' : '500'};">${d.dayName}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Total Accumulated Worship Stats Grid -->
    <div class="section-header">
      <div class="section-title">Ringkasan Total Akumulasi</div>
    </div>

    <div class="targets-grid">
      <div class="target-card">
        <div class="target-top">
          <div class="target-icon">🕌</div>
        </div>
        <div>
          <div class="target-title">${totalPrayersDone} Waktu</div>
          <div class="target-desc">Total Shalat Wajib Dikerjakan (7 Hari)</div>
        </div>
      </div>

      <div class="target-card">
        <div class="target-top">
          <div class="target-icon">✨</div>
        </div>
        <div>
          <div class="target-title">${totalTargetsDone} Target</div>
          <div class="target-desc">Target Sunnah & Dzikir Tercapai</div>
        </div>
      </div>
    </div>

    <!-- Export Printable Summary Card Button -->
    <div style="text-align: center; margin-top: 10px;">
      <button class="btn-primary" id="generate-summary-btn" style="width: 100%; justify-content: center;">
        📄 Buat Laporan Ringkasan Ibadah
      </button>
    </div>
  `;

  container.querySelector('#generate-summary-btn').addEventListener('click', () => {
    alert(`Laporan Ibadah Hari Ini (${todayKey}):\n- Total Shalat: ${allLogs[todayKey]?.prayers ? Object.values(allLogs[todayKey].prayers).filter(Boolean).length : 0} / 5\n- Istiqamah Streak: ${streak} Hari\n- Status: Barakah insyaAllah!`);
  });
}
