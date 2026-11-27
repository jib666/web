/* MARTOD — titik masuk aplikasi */
(function (M) {
  'use strict';

  M.app = {
    async start() {
      M.fx.init();
      const had = M.session.load();
      await M.boot.run(had);
      if (!had) {
        const r = await M.auth.run();
        M.session.start(r.user, r.clearance);
        M.logs.add('AUTH', `LOG MASUK BERJAYA: ${r.user} PADA TAHAP ${r.clearance} (${M.session.levelName()})`);
      }
      this.enter(had);
    },
    enter(resumed) {
      const app = document.getElementById('app');
      app.hidden = false;
      app.classList.add('app--in');
      const main = M.shell.mount(app);
      M.terminal.mount(app);
      M.router.mount(main);
      M.router.start();
      const note = M.store.popNote();
      if (note) { M.logs.add('SYS', note.toUpperCase()); M.toast(note, 'warn'); }
      M.music.start();
      if (!resumed) M.toast('SELAMAT DATANG, ' + M.session.user, 'ok');
    },
    logout() {
      M.logs.add('AUTH', 'SESI DITAMATKAN: ' + (M.session.user || ''));
      M.session.end();
      M.shell.teardown();
      location.href = location.pathname;
    }
  };

  document.addEventListener('DOMContentLoaded', () => M.app.start());
})(window.M);
