/* MARTOD core — hash router with animated transitions */
(function (M) {
  'use strict';
  const views = {};
  let current = null, cleanup = null, container = null, token = 0;
  let mem = null;   // laluan semasa dalam memori (sesetengah pemapar terbenam tidak membenarkan #/laluan dalam URL)

  M.router = {
    register(name, view) { views[name] = view; },
    names: () => Object.keys(views),
    current: () => current,
    mount(el) { container = el; },
    parse() {
      const m = /^#\/([a-z]+)(?:\/(.+))?$/.exec(mem !== null ? mem : location.hash);
      return m && views[m[1]] ? { name: m[1], arg: m[2] ? decodeURIComponent(m[2]) : null } : { name: 'dashboard', arg: null };
    },
    go(name, arg) {
      const next = '#/' + name + (arg ? '/' + encodeURIComponent(arg) : '');
      mem = next;
      try { if (location.hash !== next) location.hash = next; } catch (e) { /* abaikan */ }
      this.render();
    },
    start() {
      window.addEventListener('hashchange', () => { if (mem !== null && location.hash === mem) return; mem = location.hash; this.render(); });
      document.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href^="#/"]');
        if (!a) return;
        e.preventDefault(); mem = a.getAttribute('href'); try { location.hash = mem; } catch (x) { /* abaikan */ } this.render();
      });
      mem = location.hash;
      this.render();
    },
    async render() {
      if (!container) return;
      const { name, arg } = this.parse();
      const my = ++token;
      const same = name === current;
      if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
      if (!same && M.fx.on) { container.classList.add('leaving'); await M.sleep(140); if (my !== token) return; }
      current = name;
      M.clear(container);
      container.classList.remove('leaving');
      container.scrollTop = 0;
      const view = views[name];
      container.dataset.view = name;
      try { cleanup = view.mount(container, { arg }) || null; }
      catch (e) { console.error(e); container.textContent = 'RALAT PAPARAN: ' + e.message; }
      if (!same) {
        container.classList.remove('entering'); void container.offsetWidth; container.classList.add('entering');
        M.logs.add('NAV', 'DIBUKA ' + view.title.toUpperCase());
      }
      document.title = view.title.toUpperCase() + ' · MARTOD';
      if (M.shell && M.shell.setActive) M.shell.setActive(name);
    }
  };
})(window.M);
