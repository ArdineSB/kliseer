import Lenis from 'lenis';
import { initWorkflows } from './workflow.js';
import { mountHaze } from './haze.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
let paused = false;
let scenesLoaded = false;
let hazeLoaded = false;
let scroll: Lenis | undefined;

function syncScroll() {
  if (reduced.matches || paused || document.hidden) {
    scroll?.destroy();
    scroll = undefined;
    return;
  }
  scroll ??= new Lenis({
    autoRaf: true,
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -32 },
    stopInertiaOnNavigate: true,
  });
}

function syncMotion() {
  root.dataset.motion = paused || reduced.matches ? 'paused' : 'running';
  const toggle = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
  if (toggle) {
    toggle.hidden = reduced.matches;
    toggle.setAttribute('aria-pressed', String(paused));
    const text = toggle.querySelector('span');
    if (text) text.textContent = paused ? 'Resume motion' : 'Pause motion';
  }
  syncScroll();
  document.dispatchEvent(new Event('kliseer:motion'));
}

function loadScenes() {
  if (scenesLoaded || reduced.matches || paused) return;
  scenesLoaded = true;
  try { initWorkflows(); } catch {
    // Every scene is readable static HTML; a failed enhancement changes nothing.
    scenesLoaded = false;
  }
}

function loadHaze() {
  const canvas = document.querySelector<HTMLCanvasElement>('#haze-canvas');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (hazeLoaded || !canvas || reduced.matches || paused || document.hidden || connection?.saveData) return;
  const bounds = canvas.getBoundingClientRect();
  if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
  hazeLoaded = true;
  try { mountHaze(canvas); } catch {
    // The CSS silver/violet film remains visible if WebGL cannot be loaded.
    canvas.hidden = true;
  }
}

function whenIdle() {
  if ('requestIdleCallback' in window) window.requestIdleCallback(() => { void loadHaze(); });
  else requestAnimationFrame(() => { void loadHaze(); });
}

function boot() {
  syncMotion();
  const toggle = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
  const workflow = document.querySelector('#how-it-works');
  const hero = document.querySelector('#hero');
  if ('IntersectionObserver' in window) {
    if (workflow) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) void loadScenes();
      }, { rootMargin: '240px 0px' });
      observer.observe(workflow);
    }
    if (hero) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) whenIdle();
      });
      observer.observe(hero);
    }
  }
  toggle?.addEventListener('click', () => { paused = !paused; syncMotion(); if (!paused) { void loadScenes(); whenIdle(); } });
  reduced.addEventListener('change', () => { syncMotion(); if (!reduced.matches) { void loadScenes(); whenIdle(); } });
  document.addEventListener('visibilitychange', () => { syncScroll(); if (!document.hidden) whenIdle(); });
  window.addEventListener('pagehide', () => { scroll?.destroy(); scroll = undefined; });
  window.addEventListener('pageshow', syncScroll);
}

// The module entry itself is requested only after critical hero readiness.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
