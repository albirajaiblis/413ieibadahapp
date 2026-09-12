/* Quiz Engine & State Controller */
import { TEBAK_AYAT_QUESTIONS, TEBAK_SURAH_QUESTIONS, SAMBUNG_AYAT_QUESTIONS } from './quizData.js';
import { Store } from './store.js';

export const QuizEngine = {
  activeMode: 'tebak_ayat', // 'tebak_ayat', 'tebak_surah', 'sambung_ayat'
  questions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  answered: false,

  init(mode = 'tebak_ayat') {
    this.activeMode = mode;
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.answered = false;

    let source = TEBAK_AYAT_QUESTIONS;
    if (mode === 'tebak_surah') source = TEBAK_SURAH_QUESTIONS;
    if (mode === 'sambung_ayat') source = SAMBUNG_AYAT_QUESTIONS;

    // Shuffle questions
    this.questions = [...source].sort(() => Math.random() - 0.5);
  },

  getCurrentQuestion() {
    if (!this.questions || this.questions.length === 0) return null;
    return this.questions[this.currentIndex % this.questions.length];
  },

  submitAnswer(selectedIndex) {
    if (this.answered) return null;

    const q = this.getCurrentQuestion();
    if (!q) return null;

    this.answered = true;
    const isCorrect = selectedIndex === q.answerIndex;

    if (isCorrect) {
      this.score += 10 + (this.streak * 2); // Bonus points for streak
      this.streak += 1;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
    } else {
      this.streak = 0;
    }

    // Save high score to store
    const stats = this.getStats();
    const currentHigh = stats[this.activeMode] || 0;
    if (this.score > currentHigh) {
      stats[this.activeMode] = this.score;
      this.saveStats(stats);
    }

    return {
      isCorrect,
      correctIndex: q.answerIndex,
      selectedIndex,
      score: this.score,
      streak: this.streak,
      explanation: q.explanation
    };
  },

  nextQuestion() {
    this.currentIndex += 1;
    this.answered = false;
    return this.getCurrentQuestion();
  },

  getStats() {
    try {
      return JSON.parse(localStorage.getItem('prayer_app_quiz_stats') || '{"tebak_ayat":0,"tebak_surah":0,"sambung_ayat":0}');
    } catch (e) {
      return { tebak_ayat: 0, tebak_surah: 0, sambung_ayat: 0 };
    }
  },

  saveStats(stats) {
    try {
      localStorage.setItem('prayer_app_quiz_stats', JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save quiz stats:', e);
    }
  }
};
