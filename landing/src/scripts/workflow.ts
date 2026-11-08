export function initWorkflows() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll<HTMLElement>('[data-demo]').forEach(scene => {
    const cursor = scene.querySelector<HTMLElement>('.demo-cursor');
    const replay = scene.querySelector<HTMLButtonElement>('[data-replay]');
    if (!cursor || !replay) return;
    const animations = new Set<Animation>();
    let generation = 0;
    let visible = false;
    let running = false;
    let repeat = 0;

    const finish = () => {
      clearTimeout(repeat);
      repeat = 0;
      generation++;
      for (const animation of animations) animation.cancel();
      animations.clear();
      running = false;
      scene.classList.remove('is-playing');
      scene.dataset.phase = 'final';
      scene.querySelectorAll<HTMLElement>('[data-active]').forEach(node => delete node.dataset.active);
      replay.hidden = reduced.matches;
      replay.disabled = !visible || reduced.matches || document.documentElement.dataset.motion === 'paused';
    };
    const animate = (node: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = node.animate(keyframes, options);
      animations.add(animation);
      return animation.finished.finally(() => animations.delete(animation));
    };
    const play = async () => {
      if (!visible || reduced.matches || document.documentElement.dataset.motion === 'paused' || running || document.hidden) return;
      finish();
      const run = generation;
      running = true;
      scene.dataset.played = 'true';
      scene.dataset.phase = '0';
      scene.classList.add('is-playing');
      replay.disabled = true;
      let x = scene.clientWidth * .2;
      let y = Math.min(scene.clientHeight * .6, scene.clientHeight - 80);
      cursor.style.transform = `translate(${x}px, ${y}px)`;
      try {
        for (const phase of ['1', '2']) {
          const target = scene.querySelector<HTMLElement>(`[data-hit="${phase}"]`);
          if (!target) continue;
          const box = target.getBoundingClientRect();
          const bounds = scene.getBoundingClientRect();
          const nx = Math.min(scene.clientWidth - 28, box.left - bounds.left + box.width * .65);
          const ny = Math.min(scene.clientHeight - 36, box.top - bounds.top + box.height * .55);
          await animate(cursor, [
            { transform: `translate(${x}px, ${y}px)` },
            { transform: `translate(${nx}px, ${ny}px)` },
          ], { duration: 560, delay: phase === '1' ? 180 : 80, easing: 'cubic-bezier(.16,1,.3,1)' });
          if (run !== generation) return;
          x = nx; y = ny;
          cursor.style.transform = `translate(${x}px, ${y}px)`;
          await animate(cursor, [
            { transform: `translate(${x}px, ${y}px) scale(1)` },
            { transform: `translate(${x}px, ${y}px) scale(.8)`, offset: .5 },
            { transform: `translate(${x}px, ${y}px) scale(1)` },
          ], { duration: 180, easing: 'ease-out' });
          if (run !== generation) return;
          target.dataset.active = 'true';
          scene.dataset.phase = phase;
          const revealed = scene.querySelectorAll<HTMLElement>(`[data-reveal="${phase}"]`);
          await Promise.all(Array.from(revealed, (node, i) => animate(node, [
            { clipPath: 'inset(0 100% 0 0)', opacity: .6 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
          ], { duration: 500, delay: i * 60, easing: 'cubic-bezier(.16,1,.3,1)' })));
          if (run !== generation) return;
        }
      } catch {
        // Visibility, reduced motion, resize or explicit pause cancels to the final readable state.
      } finally {
        if (run === generation) {
          finish();
          if (visible && !document.hidden && !reduced.matches && document.documentElement.dataset.motion !== 'paused') {
            // Keep the result readable between complete, independent demonstrations.
            repeat = window.setTimeout(() => { repeat = 0; void play(); }, 1400);
          }
        }
      }
    };

    replay.hidden = reduced.matches;
    replay.addEventListener('click', () => { void play(); });
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        visible = entry.isIntersecting && entry.intersectionRatio >= .35;
        if (visible) { if (!running && !repeat) void play(); }
        else finish();
      }
    }, { threshold: [0, .35] });
    observer.observe(scene);
    const sync = () => { finish(); if (visible) void play(); };
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('kliseer:motion', sync);
    window.addEventListener('resize', sync, { passive: true });
    window.addEventListener('pagehide', finish);
    window.addEventListener('pageshow', sync);
  });
}
