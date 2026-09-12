/* Interactive Islamic Quiz & Game View */
import { QuizEngine } from '../quizEngine.js';
import { showToast } from '../app.js';

export function renderQuizView(container, activeMode = 'tebak_ayat') {
  QuizEngine.init(activeMode);
  const stats = QuizEngine.getStats();

  container.innerHTML = `
    <!-- GAME HEADER & HIGHSCORE BADGES -->
    <div class="card" style="margin-bottom: 14px; background: linear-gradient(135deg, var(--bg-card), var(--bg-surface)); border-color: var(--accent-gold-light);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.6rem;">🎯</span>
          <div>
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--accent-gold-light);">Game Kuis Islami</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Asah hafalan Al-Qur'an & wawasan keislaman</div>
          </div>
        </div>
        <div class="badge-gold" id="quiz-highscore-badge" style="font-weight: 700;">
          🏆 Rekor: ${stats[activeMode] || 0} Poin
        </div>
      </div>

      <!-- GAME MODE TABS -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;" id="quiz-mode-selector">
        <button class="btn-mode ${activeMode === 'tebak_ayat' ? 'active' : ''}" data-mode="tebak_ayat">
          📖 Tebak Ayat
        </button>
        <button class="btn-mode ${activeMode === 'tebak_surah' ? 'active' : ''}" data-mode="tebak_surah">
          🕌 Tebak Surah
        </button>
        <button class="btn-mode ${activeMode === 'sambung_ayat' ? 'active' : ''}" data-mode="sambung_ayat">
          🔗 Sambung Ayat
        </button>
      </div>
    </div>

    <!-- MAIN GAME CARD -->
    <div id="quiz-game-container">
      ${renderQuestionCard()}
    </div>
  `;

  attachQuizEvents(container);
}

function renderQuestionCard() {
  const q = QuizEngine.getCurrentQuestion();
  if (!q) {
    return `<div class="card" style="text-align: center; padding: 24px;">Tidak ada soal tersedia.</div>`;
  }

  const mode = QuizEngine.activeMode;
  let questionHeader = 'Pertanyaan:';
  if (mode === 'tebak_ayat') questionHeader = '📖 Tebak Surah & Nomor Ayat:';
  if (mode === 'tebak_surah') questionHeader = '🕌 Tebak Nama Surah:';
  if (mode === 'sambung_ayat') questionHeader = '🔗 Lanjutan Bacaan Ayat Berikutnya:';

  return `
    <div class="card animate-fade-in" style="margin-bottom: 14px;">
      <!-- TOP SCORE & STREAK BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid var(--border-light);">
        <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-muted);">
          Soal Ke-${QuizEngine.currentIndex + 1}
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--primary-emerald);">
            ⭐ Skor: <span id="current-score">${QuizEngine.score}</span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #F59E0B;">
            🔥 Streak: <span id="current-streak">${QuizEngine.streak}</span>
          </div>
        </div>
      </div>

      <!-- QUESTION PROMPT -->
      <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px;">
        ${q.prompt || questionHeader}
      </div>

      <!-- ARABIC & LATIN DISPLAY IF AVAILABLE -->
      ${q.arabic ? `
        <div style="background: rgba(5, 150, 105, 0.08); border-radius: var(--radius-md); padding: 16px; text-align: center; margin-bottom: 12px; border: 1px solid rgba(5, 150, 105, 0.2);">
          <div style="font-family: 'Amiri', serif; font-size: 1.8rem; font-weight: 700; color: var(--accent-gold-light); line-height: 1.8; direction: rtl;" lang="ar">
            ${q.arabic}
          </div>
          ${q.latin ? `<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; margin-top: 6px;">"${q.latin}"</div>` : ''}
          ${q.translation ? `<div style="font-size: 0.82rem; color: var(--text-main); margin-top: 4px;">${q.translation}</div>` : ''}
        </div>
      ` : ''}

      ${q.verseGiven ? `
        <div style="background: rgba(245, 158, 11, 0.08); border-radius: var(--radius-md); padding: 14px; text-align: center; margin-bottom: 12px; border: 1px solid rgba(245, 158, 11, 0.2);">
          <div style="font-family: 'Amiri', serif; font-size: 1.6rem; font-weight: 700; color: var(--accent-gold-light); line-height: 1.7; direction: rtl;" lang="ar">
            ${q.verseGiven}
          </div>
          <div style="font-size: 1.1rem; color: var(--primary-emerald); font-weight: 800; margin-top: 6px;">
            ${q.nextText || '...'}
          </div>
        </div>
      ` : ''}

      <!-- MULTIPLE CHOICE OPTIONS -->
      <div style="display: flex; flex-direction: column; gap: 8px;" id="quiz-options-container">
        ${q.options.map((opt, idx) => `
          <button class="quiz-option-btn" data-index="${idx}">
            <span class="quiz-option-num">${String.fromCharCode(65 + idx)}</span>
            <span style="font-size: 0.95rem; font-weight: 600; text-align: left;" ${isArabicText(opt) ? 'lang="ar" style="font-family: \'Amiri\', serif; font-size: 1.3rem;"' : ''}>${opt}</span>
          </button>
        `).join('')}
      </div>

      <!-- EXPLANATION & FEEDBACK CONTAINER -->
      <div id="quiz-feedback-box" style="margin-top: 14px; display: none;"></div>

      <!-- NEXT BUTTON -->
      <button class="btn-primary" id="btn-next-question" style="width: 100%; margin-top: 14px; display: none; justify-content: center; font-weight: 700;">
        Soal Berikutnya ➔
      </button>
    </div>
  `;
}

function isArabicText(text) {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

function attachQuizEvents(container) {
  // Mode switcher tabs
  container.querySelectorAll('#quiz-mode-selector .btn-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      renderQuizView(container, mode);
    });
  });

  // Attach option click handlers
  const gameBox = container.querySelector('#quiz-game-container');
  if (!gameBox) return;

  const optionBtns = gameBox.querySelectorAll('.quiz-option-btn');
  const feedbackBox = gameBox.querySelector('#quiz-feedback-box');
  const nextBtn = gameBox.querySelector('#btn-next-question');

  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (QuizEngine.answered) return;

      const idx = parseInt(btn.getAttribute('data-index'));
      const result = QuizEngine.submitAnswer(idx);
      if (!result) return;

      // Update option styles
      optionBtns.forEach((b, i) => {
        b.disabled = true;
        if (i === result.correctIndex) {
          b.classList.add('correct');
          b.innerHTML += `<span style="margin-left: auto;">✅</span>`;
        } else if (i === result.selectedIndex && !result.isCorrect) {
          b.classList.add('wrong');
          b.innerHTML += `<span style="margin-left: auto;">❌</span>`;
        }
      });

      // Update top bar stats
      container.querySelector('#current-score').textContent = result.score;
      container.querySelector('#current-streak').textContent = result.streak;

      const stats = QuizEngine.getStats();
      const activeMode = QuizEngine.activeMode;
      container.querySelector('#quiz-highscore-badge').textContent = `🏆 Rekor: ${stats[activeMode] || 0} Poin`;

      // Show Feedback & Explanation
      feedbackBox.style.display = 'block';
      if (result.isCorrect) {
        feedbackBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid #10B981; border-radius: var(--radius-md); padding: 12px; color: #10B981;">
            <div style="font-weight: 700; font-size: 0.95rem;">🎉 Benar Sekali! (+${10 + ((result.streak - 1) * 2)} poin)</div>
            <div style="font-size: 0.82rem; margin-top: 4px; color: var(--text-main);">${result.explanation}</div>
          </div>
        `;
        showToast('Jawaban Benar! 🎉');
      } else {
        feedbackBox.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid #EF4444; border-radius: var(--radius-md); padding: 12px; color: #EF4444;">
            <div style="font-weight: 700; font-size: 0.95rem;">❌ Masih Kurang Tepat</div>
            <div style="font-size: 0.82rem; margin-top: 4px; color: var(--text-main);">${result.explanation}</div>
          </div>
        `;
      }

      nextBtn.style.display = 'flex';
    });
  });

  // Next question button
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      QuizEngine.nextQuestion();
      gameBox.innerHTML = renderQuestionCard();
      attachQuizEvents(container);
    });
  }
}
