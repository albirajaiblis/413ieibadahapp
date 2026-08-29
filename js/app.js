/* Main Application Controller & Router */
import { Store } from './store.js';
import { renderHomeView } from './views/homeView.js';
import { renderPrayerView } from './views/prayerView.js';
import { renderWorshipView } from './views/worshipView.js';
import { renderProgressView } from './views/progressView.js';
import { renderSettingsView } from './views/settingsView.js';

let currentTab = 'home';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme Mode & Preset
  const settings = Store.getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  document.documentElement.setAttribute('data-theme-preset', settings.themePreset || 'emerald');

  // Register PWA Service Worker
  registerServiceWorker();

  // Navigation Controller
  setupNavigation();

  // Initial View Render
  renderCurrentView();

  // Global Quick Dark Theme Toggle Button Handler
  const quickThemeBtn = document.getElementById('quick-theme-toggle');
  if (quickThemeBtn) {
    quickThemeBtn.addEventListener('click', () => {
      const s = Store.getSettings();
      const newTheme = s.theme === 'dark' ? 'light' : 'dark';
      Store.saveSettings({ theme: newTheme });
      document.documentElement.setAttribute('data-theme', newTheme);
      if (currentTab === 'settings') {
        renderCurrentView();
      }
    });
  }
});

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      if (targetTab === currentTab) return;

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      currentTab = targetTab;
      renderCurrentView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderCurrentView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  container.style.opacity = '0';
  setTimeout(() => {
    switch (currentTab) {
      case 'home':
        renderHomeView(container, (tab) => switchTab(tab));
        break;
      case 'prayer':
        renderPrayerView(container);
        break;
      case 'worship':
        renderWorshipView(container);
        break;
      case 'progress':
        renderProgressView(container);
        break;
      case 'settings':
        renderSettingsView(container, () => renderCurrentView());
        break;
      default:
        renderHomeView(container, (tab) => switchTab(tab));
    }
    container.style.opacity = '1';
  }, 100);
}

function switchTab(tabName) {
  const targetNav = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
  if (targetNav) targetNav.click();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('[PWA] Service Worker registered with scope:', reg.scope))
        .catch(err => console.log('[PWA] Service Worker registration failed:', err));
    });
  }
}

export function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
