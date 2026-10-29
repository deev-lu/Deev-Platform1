/* Klar Access 1.0.0 — MIT. Display preferences, not a compliance certification. */
(() => {
  'use strict';
  if (window.KlarAccess) return;
  const script = document.currentScript;
  if (!script?.src) return;
  const base = new URL('.', script.src);
  const config = { ...script.dataset };
  const defaults = Object.freeze({ size: 0, contrast: 'off', spacing: false, font: false,
    links: false, motion: false, guide: false, cursor: false });
  const key = config.storageKey || 'klar-access:v1';
  const words = {
    de: { title: 'Barrierefreiheit', intro: 'So liest sich die Seite besser für dich.', open: 'Barrierefreiheit öffnen', close: 'Einstellungen schließen',
      display: 'Darstellung', navigation: 'Orientierung & Ruhe', size: 'Textgröße', smaller: 'Text verkleinern', larger: 'Text vergrößern',
      contrast: 'Kontrast', off: 'Original', light: 'Hell', dark: 'Dunkel', spacing: 'Mehr Textabstand', spacingHelp: 'Mehr Platz zwischen Zeilen und Wörtern',
      font: 'Klare Schrift', fontHelp: 'Eine vertraute, serifenlose Schrift', links: 'Links hervorheben', linksHelp: 'Textlinks durchgehend unterstreichen',
      motion: 'Bewegung reduzieren', motionHelp: 'CSS-Bewegungen stoppen, Videos pausieren', system: 'Bereits durch deine Systemeinstellung aktiv',
      guide: 'Lesehilfe', guideHelp: 'Eine Linie folgt Maus oder Tastaturfokus', cursor: 'Großer Mauszeiger', cursorHelp: 'Besser sichtbar auf dieser Seite',
      reset: 'Alles zurücksetzen', resetDone: 'Einstellungen zurückgesetzt.', saved: 'Nur in diesem Browser gespeichert.', temporary: 'Nur für diesen Besuch gespeichert.',
      note: 'Diese Einstellungen passen die Darstellung an.', statement: 'Zur Erklärung zur Barrierefreiheit', skip: 'Zum Hauptinhalt springen',
      changed: 'Einstellung aktualisiert.', on: 'Ein', disabled: 'Aus', demo: 'Einstellungen' },
    en: { title: 'Accessibility', intro: 'Make this page easier to read your way.', open: 'Open accessibility settings', close: 'Close settings',
      display: 'Appearance', navigation: 'Focus & movement', size: 'Text size', smaller: 'Decrease text size', larger: 'Increase text size',
      contrast: 'Contrast', off: 'Original', light: 'Light', dark: 'Dark', spacing: 'Text spacing', spacingHelp: 'More space between lines and words',
      font: 'Clear typeface', fontHelp: 'A familiar sans-serif typeface', links: 'Highlight links', linksHelp: 'Always underline text links',
      motion: 'Reduce motion', motionHelp: 'Stop CSS movement and pause videos', system: 'Already active through your system preference',
      guide: 'Reading guide', guideHelp: 'A line follows your pointer or keyboard focus', cursor: 'Large pointer', cursorHelp: 'Easier to see on this page',
      reset: 'Reset all settings', resetDone: 'Settings reset.', saved: 'Saved only in this browser.', temporary: 'Saved only for this visit.',
      note: 'These settings adjust the page appearance.', statement: 'Accessibility statement', skip: 'Skip to main content',
      changed: 'Setting updated.', on: 'On', disabled: 'Off', demo: 'Settings' },
    fr: { title: 'Accessibilité', intro: 'Adaptez la page à votre confort de lecture.', open: 'Ouvrir les réglages d’accessibilité', close: 'Fermer les réglages',
      display: 'Affichage', navigation: 'Repères et mouvement', size: 'Taille du texte', smaller: 'Réduire le texte', larger: 'Agrandir le texte',
      contrast: 'Contraste', off: 'Original', light: 'Clair', dark: 'Sombre', spacing: 'Espacement du texte', spacingHelp: 'Plus d’espace entre les lignes et les mots',
      font: 'Police lisible', fontHelp: 'Une police familière sans empattement', links: 'Souligner les liens', linksHelp: 'Toujours souligner les liens textuels',
      motion: 'Réduire les mouvements', motionHelp: 'Arrêter les animations CSS et mettre les vidéos en pause', system: 'Déjà actif dans vos réglages système',
      guide: 'Guide de lecture', guideHelp: 'Une ligne suit le pointeur ou le focus clavier', cursor: 'Grand pointeur', cursorHelp: 'Plus visible sur cette page',
      reset: 'Tout réinitialiser', resetDone: 'Réglages réinitialisés.', saved: 'Enregistré uniquement dans ce navigateur.', temporary: 'Enregistré uniquement pour cette visite.',
      note: 'Ces réglages adaptent l’affichage de la page.', statement: 'Déclaration d’accessibilité', skip: 'Aller au contenu principal',
      changed: 'Réglage mis à jour.', on: 'Activé', disabled: 'Désactivé', demo: 'Réglages' }
  };
  const icon = (name) => {
    const paths = {
      access: '<circle cx="12" cy="4" r="2"/><path d="m4 9 8 2 8-2M12 11v5m0 0-4 6m4-6 4 6"/>',
      close: '<path d="m6 6 12 12M6 18 18 6"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
      reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>', check: '<path d="m5 12 4 4 10-10"/>',
      arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
      spacing: '<path d="M9 5h12M9 12h12M9 19h12M3 4v16m-2-2 2 2 2-2M1 6l2-2 2 2"/>',
      font: '<path d="m3 20 7-16 7 16M6 14h8M17 10h5m-2-2v12"/>',
      links: '<path d="m10 14 4-4m-6 6-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m4 0 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(2 -2) scale(.9)"/>',
      motion: '<path d="M8 5v14M16 5v14"/>', guide: '<path d="M3 6h18M3 18h18"/><rect x="2" y="10" width="20" height="4" rx="1"/>',
      cursor: '<path d="m5 3 14 10-7 1-3 7z"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.access}</svg>`;
  };
  const clean = (input) => {
    const out = { ...defaults };
    if (!input || typeof input !== 'object') return out;
    if (Number.isInteger(input.size) && input.size >= 0 && input.size <= 4) out.size = input.size;
    if (['off', 'light', 'dark'].includes(input.contrast)) out.contrast = input.contrast;
    for (const name of ['spacing', 'font', 'links', 'motion', 'guide', 'cursor']) out[name] = input[name] === true;
    return out;
  };
  function mount() {
    if (!window.HTMLDialogElement || !HTMLDialogElement.prototype.showModal) { delete window.KlarAccess; return; }
    const root = document.documentElement;
    const lang = (config.lang || root.lang || 'de').split('-')[0].toLowerCase();
    const t = words[lang] || words.de;
    let settings = { ...defaults }, persistent = config.storage !== 'off', destroyed = false;
    if (persistent) {
      try { const raw = localStorage.getItem(key); try { settings = clean(JSON.parse(raw)); } catch { /* Malformed preference: safe defaults. */ } }
      catch { persistent = false; }
    }
    const controller = new AbortController();
    const on = (el, event, fn, options = {}) => el.addEventListener(event, fn, { ...options, signal: controller.signal });
    const original = new Map(), temporaryTabindex = new Set();
    const setRoot = (name, value) => {
      if (!original.has(name)) original.set(name, root.getAttribute(name));
      if (value == null) root.removeAttribute(name); else root.setAttribute(name, value);
    };
    const properties = ['--ka-base-size', '--ka-scale'];
    const oldProperties = properties.map(name => [name, root.style.getPropertyValue(name), root.style.getPropertyPriority(name)]);
    const baseSize = parseFloat(getComputedStyle(root).fontSize) || 16;
    const pageStyle = document.createElement('link');
    pageStyle.rel = 'stylesheet'; pageStyle.href = new URL('klar-page.css', base).href;
    document.head.append(pageStyle);
    const host = document.createElement('klar-access');
    host.setAttribute('data-ka-ignore', '');
    host.setAttribute('lang', words[lang] ? lang : 'de');
    host.style.setProperty('all', 'initial', 'important');
    document.body.prepend(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet'; sheet.href = new URL('klar-panel.css', base).href;
    shadow.append(sheet);
    const stylesheetFailure = () => { window.KlarAccess?.destroy?.(); };
    on(pageStyle, 'error', stylesheetFailure);
    on(sheet, 'error', stylesheetFailure);
    const ui = document.createElement('div');
    ui.className = 'ka-ui';
    ui.hidden = true;
    on(sheet, 'load', () => { ui.hidden = false; });
    ui.dataset.side = config.position === 'left' ? 'left' : 'right';
    const color = /^#[\da-f]{6}$/i.test(config.color || '') ? config.color : '#b43d26';
    ui.style.setProperty('--accent', color);
    // The configurable accent is decorative; text and focus use fixed, tested colors.
    const safeURL = (value) => {
      try { const u = new URL(value, location.href); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; }
    };
    let main;
    const getMain = () => {
      try { return document.querySelector(config.main || 'main, [role="main"]'); } catch { return null; }
    };
    main = getMain();
    ui.innerHTML = `
      <button class="ka-skip" type="button" ${main ? '' : 'hidden'}>${t.skip}</button>
      <button class="ka-launcher" type="button" aria-label="${t.open}" aria-haspopup="dialog" aria-expanded="false" aria-controls="ka-dialog">${icon('access')}</button>
      <div class="ka-guide" hidden aria-hidden="true"></div>
      <dialog id="ka-dialog" aria-labelledby="ka-title">
        <div class="ka-header"><div class="ka-heading"><span class="ka-symbol">${icon('access')}</span><div><span class="ka-eyebrow">KLAR ACCESS</span><h2 id="ka-title">${t.title}</h2></div></div><button class="ka-close ka-icon-button" type="button" aria-label="${t.close}" autofocus>${icon('close')}</button></div>
        <div class="ka-content"><p class="ka-intro">${t.intro}</p><h3>${t.display}</h3>
          <div class="ka-size"><span id="ka-size-label">${t.size}</span><div class="ka-stepper" role="group" aria-labelledby="ka-size-label"><button class="ka-icon-button" data-step="-1" type="button" aria-label="${t.smaller}">${icon('minus')}</button><output id="ka-size-value" aria-live="off">100%</output><button class="ka-icon-button" data-step="1" type="button" aria-label="${t.larger}">${icon('plus')}</button></div></div>
          <fieldset class="ka-contrast"><legend>${t.contrast}</legend><div class="ka-segments">${['off','light','dark'].map(c => `<label><input type="radio" name="contrast" value="${c}"><span><i class="ka-swatch ${c}" aria-hidden="true"></i>${t[c]}</span></label>`).join('')}</div></fieldset>
          <div class="ka-rows">${row('spacing')}${row('font')}</div><h3>${t.navigation}</h3><div class="ka-rows">${['links','motion','guide','cursor'].map(row).join('')}</div>
          <p class="ka-note">${t.note}</p><a class="ka-statement" hidden>${t.statement}${icon('arrow')}</a>
        </div><footer><button class="ka-reset" type="button">${icon('reset')}${t.reset}</button><p class="ka-storage"></p></footer>
      </dialog><span class="ka-sr" role="status" aria-live="polite" aria-atomic="true"></span>`;
    function row(name) {
      return `<div class="ka-row"><span class="ka-row-icon">${icon(name)}</span><div class="ka-row-copy"><span id="ka-${name}-label">${t[name]}</span><small id="ka-${name}-help">${t[name+'Help']}</small></div><button class="ka-switch" type="button" role="switch" aria-checked="false" aria-labelledby="ka-${name}-label" aria-describedby="ka-${name}-help" data-setting="${name}"><span>${icon('check')}</span></button></div>`;
    }
    shadow.append(ui);
    const $ = selector => shadow.querySelector(selector);
    if (config.brand) $('.ka-eyebrow').textContent = config.brand.slice(0, 48);
    const dialog = $('dialog'), launcher = $('.ka-launcher'), guide = $('.ka-guide');
    let returnFocus = null, announcementTimer, pointerFrame = 0, guideY = 0;
    if (config.launcher === 'hidden') launcher.hidden = true;
    const statement = config.statement ? safeURL(config.statement) : '';
    if (statement) { $('.ka-statement').href = statement; $('.ka-statement').hidden = false; }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const effectiveMotion = () => reduced.matches || settings.motion;
    const announce = value => { clearTimeout(announcementTimer); $('.ka-sr').textContent = ''; announcementTimer = setTimeout(() => { if (!destroyed) $('.ka-sr').textContent = value; }, 80); };
    const save = () => {
      if (!persistent) return;
      try { localStorage.setItem(key, JSON.stringify(settings)); }
      catch { persistent = false; }
    };
    const pauseVideos = () => { if (effectiveMotion()) document.querySelectorAll('video:not([data-ka-ignore])').forEach(v => { if (!v.closest('[data-ka-ignore]')) v.pause(); }); };
    const apply = (notify = true) => {
      if (settings.size) {
        root.style.setProperty('--ka-base-size', `${baseSize}px`);
        root.style.setProperty('--ka-scale', String(1 + settings.size * .25));
      } else oldProperties.forEach(([name, value, priority]) => value ? root.style.setProperty(name, value, priority) : root.style.removeProperty(name));
      setRoot('data-ka-size', settings.size ? '' : null);
      setRoot('data-ka-contrast', settings.contrast === 'off' ? null : settings.contrast);
      for (const name of ['spacing','font','links','cursor']) setRoot('data-ka-'+name, settings[name] ? '' : null);
      setRoot('data-ka-motion', effectiveMotion() ? '' : null);
      ui.dataset.motion = String(effectiveMotion());
      guide.hidden = !settings.guide || dialog.open;
      if (settings.guide && !guideY) moveGuide(innerHeight / 2);
      pauseVideos();
      $('#ka-size-value').textContent = `${100 + settings.size * 25}%`;
      $('[data-step="-1"]').disabled = settings.size === 0;
      $('[data-step="1"]').disabled = settings.size === 4;
      shadow.querySelectorAll('[name="contrast"]').forEach(input => { input.checked = input.value === settings.contrast; });
      shadow.querySelectorAll('[data-setting]').forEach(button => {
        const name = button.dataset.setting;
        button.setAttribute('aria-checked', String(name === 'motion' ? effectiveMotion() : settings[name]));
        button.disabled = name === 'motion' && reduced.matches;
      });
      $('#ka-motion-help').textContent = reduced.matches ? t.system : t.motionHelp;
      $('.ka-storage').textContent = persistent ? t.saved : t.temporary;
      if (notify) document.dispatchEvent(new CustomEvent('klar-access:change', { detail: { settings: { ...settings }, reducedMotion: effectiveMotion() } }));
    };
    const change = (next, message = t.changed) => { settings = clean({ ...settings, ...next }); save(); apply(); announce(message); };
    function open(opener) {
      if (destroyed || dialog.open) return;
      returnFocus = opener || document.activeElement;
      dialog.showModal(); dialog.scrollTop = 0; $('.ka-content').scrollTop = 0;
      launcher.setAttribute('aria-expanded', 'true'); guide.hidden = true;
      $('.ka-close').focus({ preventScroll: true });
    }
    function close() { if (dialog.open) dialog.close(); }
    on(dialog, 'close', () => {
      launcher.setAttribute('aria-expanded', 'false'); guide.hidden = !settings.guide;
      if (returnFocus?.isConnected && typeof returnFocus.focus === 'function') returnFocus.focus({ preventScroll: true });
      else if (!launcher.hidden) launcher.focus({ preventScroll: true });
    });
    on(launcher, 'click', () => open(launcher));
    on($('.ka-close'), 'click', close);
    on(dialog, 'click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } });
    // Keep keyboard focus within the modal, including across its shadow boundary.
    on(dialog, 'keydown', e => {
      if (e.key !== 'Tab') return;
      const list = [...dialog.querySelectorAll('button:not(:disabled),input:checked,a[href]')].filter(el => !el.hidden && el.getClientRects().length);
      const first = list[0], last = list[list.length - 1], active = shadow.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    });
    on(ui, 'click', e => {
      const button = e.target.closest('button');
      if (button?.dataset.setting) change({ [button.dataset.setting]: !settings[button.dataset.setting] });
      if (button?.dataset.step) change({ size: Math.max(0, Math.min(4, settings.size + Number(button.dataset.step))) }, `${t.size}: ${100 + Math.max(0, Math.min(4, settings.size + Number(button.dataset.step))) * 25}%`);
    });
    on(ui, 'change', e => { if (e.target.name === 'contrast') change({ contrast: e.target.value }); });
    on($('.ka-reset'), 'click', () => change(defaults, t.resetDone));
    on(document, 'click', e => {
      const trigger = e.target instanceof Element ? e.target.closest('[data-klar-access-open]') : null;
      if (trigger) { e.preventDefault(); open(trigger); }
    });
    on($('.ka-skip'), 'click', () => {
      const target = getMain(); if (!target) return;
      const had = target.hasAttribute('tabindex');
      if (!had) { target.setAttribute('tabindex', '-1'); temporaryTabindex.add(target); on(target, 'blur', () => { if (target.getAttribute('tabindex') === '-1') target.removeAttribute('tabindex'); temporaryTabindex.delete(target); }, { once: true }); }
      target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    function moveGuide(y) {
      guideY = Math.max(0, Math.min(innerHeight - 4, y));
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => { pointerFrame = 0; guide.style.top = `${guideY}px`; });
    }
    on(document, 'pointermove', e => { if (settings.guide && !dialog.open && e.pointerType !== 'touch') moveGuide(e.clientY + 20); }, { passive: true });
    on(document, 'focusin', e => { if (settings.guide && !dialog.open && e.target !== host) moveGuide(e.target.getBoundingClientRect().bottom + 4); });
    on(document, 'play', e => { if (effectiveMotion() && e.target instanceof HTMLVideoElement && e.target.autoplay && !e.target.closest('[data-ka-ignore]')) e.target.pause(); }, { capture: true });
    on(reduced, 'change', () => apply());
    on(window, 'storage', e => { if (persistent && (e.key === key || e.key === null)) { settings = clean(e.key === null ? null : (() => { try { return JSON.parse(e.newValue); } catch { return null; } })()); apply(); } });
    // Frameworks can add routes, videos or a main landmark after initial load.
    let mutationQueued = false;
    const observer = new MutationObserver(records => {
      if (mutationQueued || !records.some(r => r.addedNodes.length)) return;
      mutationQueued = true;
      queueMicrotask(() => { mutationQueued = false; if (!destroyed) { pauseVideos(); $('.ka-skip').hidden = !getMain(); } });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    apply(false);
    window.KlarAccess = Object.freeze({
      version: '1.0.0', open: () => open(), close,
      reset: () => change(defaults, t.resetDone),
      getSettings: () => ({ ...settings }),
      setSettings: next => change(next),
      destroy: () => {
        if (destroyed) return;
        close(); destroyed = true; controller.abort(); observer.disconnect();
        clearTimeout(announcementTimer); cancelAnimationFrame(pointerFrame);
        temporaryTabindex.forEach(target => { if (target.getAttribute('tabindex') === '-1') target.removeAttribute('tabindex'); });
        host.remove(); pageStyle.remove();
        original.forEach((value, name) => value === null ? root.removeAttribute(name) : root.setAttribute(name, value));
        oldProperties.forEach(([name, value, priority]) => value ? root.style.setProperty(name, value, priority) : root.style.removeProperty(name));
        delete window.KlarAccess;
      }
    });
    document.dispatchEvent(new CustomEvent('klar-access:ready', { detail: { version: '1.0.0' } }));
  }
  // Reserve the namespace also while DOMContentLoaded is pending.
  window.KlarAccess = Object.freeze({ version: '1.0.0', pending: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
