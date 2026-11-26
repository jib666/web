/* MARTOD core — visual effects, typing, sound, toasts, overlay stack */
(function (M) {
  'use strict';
  const h = M.h;
  const FXKEY = 'martod.fx';
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let on;
  try { const v = localStorage.getItem(FXKEY); on = v == null ? !reduce : v === '1'; } catch (e) { on = !reduce; }
  let sound = false;
  let actx = null;

  function apply() { document.body.classList.toggle('fx-on', on); document.body.classList.toggle('fx-off', !on); }

  M.fx = {
    get on() { return on; },
    set(v) { on = !!v; try { localStorage.setItem(FXKEY, on ? '1' : '0'); } catch (e) { /* ignore */ } apply(); },
    toggle() { this.set(!on); return on; },
    init: apply,

    /* Typewriter: types `text` into el. Returns a promise; pass ctl={skip:false} to allow skipping. */
    async type(el, text, speed, ctl) {
      const sp = speed == null ? 16 : speed;
      if (!on || sp === 0) { el.textContent = text; return; }
      el.textContent = '';
      for (let i = 0; i < text.length; i++) {
        if (ctl && ctl.skip) { el.textContent = text; return; }
        el.textContent += text[i];
        await M.sleep(sp + (text[i] === ' ' ? 0 : Math.random() * sp * 0.6));
      }
    },
    glitch(el, ms) {
      if (!on) return;
      el.classList.add('glitching');
      setTimeout(() => el.classList.remove('glitching'), ms || 500);
    },
    flash(kind) {
      const f = h('div', { class: 'flash flash--' + (kind || 'red') });
      document.body.append(f);
      setTimeout(() => f.remove(), 700);
    },
    countUp(el, to, ms) {
      if (!on || to === 0) { el.textContent = to; return; }
      const t0 = performance.now(), dur = ms || 700;
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    },
    sound: { get on() { return sound; }, set(v) { sound = !!v; } },
    beep(kind) {
      if (!sound) return;
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        const seq = { ok: [[660, .07], [880, .09]], fail: [[180, .16], [120, .22]], key: [[1400, .015]], open: [[520, .05], [390, .05]] }[kind] || [[600, .06]];
        let t = actx.currentTime;
        seq.forEach(([f, d]) => {
          const o = actx.createOscillator(), g = actx.createGain();
          o.type = kind === 'fail' ? 'sawtooth' : 'square'; o.frequency.value = f;
          g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
          o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d); t += d;
        });
      } catch (e) { /* ignore */ }
    }
  };

  /* ---- toasts ---- */
  M.toast = function (msg, kind) {
    let box = document.getElementById('toasts');
    if (!box) { box = h('div', { id: 'toasts' }); document.body.append(box); }
    const t = h('div', { class: 'toast toast--' + (kind || 'info') }, h('span', { class: 'toast__tag' }, ({ info: 'INFO', ok: 'OK', warn: 'AMARAN', err: 'RALAT' }[kind || 'info'] || String(kind).toUpperCase())), h('span', null, msg));
    box.append(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 400); }, 3600);
  };

  /* ---- overlay stack: Escape closes the top-most overlay ---- */
  const stack = [];
  M.overlay = {
    root() { return document.getElementById('overlays'); },
    push(el, onClose) {
      this.root().append(el);
      stack.push({ el, onClose });
      document.body.classList.add('has-overlay');
      return () => this.pop(el);
    },
    pop(el) {
      const i = stack.findIndex((s) => s.el === el);
      if (i < 0) return;
      const [s] = stack.splice(i, 1);
      s.el.classList.add('closing');
      const done = () => { s.el.remove(); };
      setTimeout(done, M.fx.on ? 180 : 0);
      if (!stack.length) document.body.classList.remove('has-overlay');
      if (s.onClose) s.onClose();
    },
    top: () => stack[stack.length - 1] || null,
    count: () => stack.length
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const t = M.overlay.top();
      if (t) { e.preventDefault(); M.overlay.pop(t.el); }
    }
  });

  /* ---- generic modal ---- */
  M.modal = {
    open(opts) {
      const body = h('div', { class: 'modal__body' });
      if (opts.body) body.append(opts.body);
      const actions = h('div', { class: 'modal__actions' });
      const wrap = h('div', { class: 'modal-wrap', role: 'dialog', 'aria-modal': 'true' },
        h('div', { class: 'modal-backdrop', onClick: () => close() }),
        h('div', { class: 'modal' + (opts.wide ? ' modal--wide' : '') + (opts.danger ? ' modal--danger' : '') },
          h('div', { class: 'modal__head' },
            h('span', { class: 'modal__title' }, opts.title || ''),
            h('button', { class: 'icon-btn', 'aria-label': 'Close', onClick: () => close() }, M.icon('x'))),
          body, actions));
      let closed = false;
      const close = () => { if (!closed) { closed = true; M.overlay.pop(wrap); } };
      (opts.actions || []).forEach((a) => {
        actions.append(h('button', {
          class: 'btn ' + (a.kind ? 'btn--' + a.kind : ''),
          onClick: async () => { const r = a.onClick ? await a.onClick(close) : undefined; if (r !== false && a.close !== false) close(); }
        }, a.icon ? M.icon(a.icon, 15) : null, a.label));
      });
      M.overlay.push(wrap, opts.onClose);
      setTimeout(() => { const f = wrap.querySelector('input,select,textarea,button.btn'); if (f && !opts.noFocus) f.focus(); }, 30);
      return { close, el: wrap, body, actions };
    },
    confirm(title, message, okLabel, danger) {
      return new Promise((res) => {
        let settled = false;
        const m = M.modal.open({
          title, danger: danger !== false,
          body: h('p', { class: 'modal__msg' }, message),
          actions: [
            { label: 'BATAL', onClick: () => { settled = true; res(false); } },
            { label: okLabel || 'SAHKAN', kind: danger === false ? 'primary' : 'danger', onClick: () => { settled = true; res(true); } }
          ],
          onClose: () => { if (!settled) res(false); }
        });
        return m;
      });
    },
    alert(title, message, kind) {
      return M.modal.open({
        title, danger: kind === 'danger', body: h('p', { class: 'modal__msg' }, message),
        actions: [{ label: 'FAHAM', kind: 'primary' }]
      });
    }
  };
})(window.M);
