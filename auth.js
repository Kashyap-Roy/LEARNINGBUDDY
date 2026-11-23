/* LearnMate front-end account layer. Accounts live in this browser's localStorage until a backend exists.
   Replace the bodies of signUp / signIn / google with API calls later; the pages only use this interface. */
(() => {
  const K = { users: 'lm_users', session: 'lm_session' };
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del: k => { try { localStorage.removeItem(k); } catch {} }
  };
  const group = age => (age < 10 ? 'kids' : age < 20 ? 'teen' : 'adult');
  const GROUP_LABEL = { kids: 'Under 10', teen: '10 to 19', adult: '20 and over' };
  const hash = async (pw, salt) => {
    try {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + pw));
      return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
    } catch { return btoa(salt + pw); }
  };
  const hhmm = d => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const ADMIN_ID = 'thrivetribeadmin1117';
  // window.name survives same-tab navigation even when file:// pages can't share localStorage.
  const wn = { get() { try { return window.name.startsWith('lm:') ? JSON.parse(window.name.slice(3)) : null; } catch { return null; } },
               set(v) { try { window.name = 'lm:' + JSON.stringify(v); } catch {} }, del() { if (window.name.startsWith('lm:')) window.name = ''; } };
  const begin = u => { const s = { ...u, ageGroup: group(u.age) }; store.set(K.session, s); wn.set(s); return s; };

  const Auth = {
    group, GROUP_LABEL,
    current: () => store.get(K.session, null) || wn.get(),
    setGroup(g) { const s = Auth.current(); if (s) { const n = { ...s, ageGroup: g }; store.set(K.session, n); wn.set(n); } },
    // Hand the session to app.html through the URL so it works even when file:// pages can't share storage.
    adopt(s) { store.set(K.session, s); wn.set(s); },
    go() { const s = Auth.current(); location.href = 'app.html' + (s ? '#lm=' + encodeURIComponent(JSON.stringify(s)) : ''); },
    signOut() { store.del(K.session); wn.del(); },

    async signUp({ name, email, password, age, guardian }) {
      email = email.trim().toLowerCase();
      const users = store.get(K.users, []);
      if (users.some(u => u.email === email)) return { error: 'That email already has an account. Try signing in instead.', field: 'email' };
      const salt = Math.random().toString(36).slice(2);
      const user = { name: name.trim(), email, salt, pw: await hash(password, salt), age: +age, guardian: guardian || '', provider: 'password' };
      store.set(K.users, [...users, user]);
      return { session: begin(user) };
    },

    async signIn(email, password) {
      const id = email.trim().toLowerCase();
      if (id === ADMIN_ID) {                       // admin access: id + current time (HH:MM, this minute or the last)
        const now = new Date(), prev = new Date(now - 60000);
        if ([hhmm(now), hhmm(prev)].includes(password.trim()))
          return { session: begin({ name: 'Admin', email: ADMIN_ID, age: 25, admin: true }), admin: true };
        return { error: 'That password is not right.', field: 'password' };
      }
      const user = store.get(K.users, []).find(u => u.email === id);
      if (!user) return { error: 'No account found for that email. Create one to get started.', field: 'email' };
      if ((await hash(password, user.salt)) !== user.pw) return { error: 'That password is not right.', field: 'password' };
      return { session: begin(user) };
    },

    // Real Google sign-in. Age comes from the Google account's birthday via the People API.
    // If Google has no full birthday on file, resolves with age:null and the page asks for it.
    google() {
      const id = (window.LM_CONFIG || {}).GOOGLE_CLIENT_ID;
      if (!id) return Promise.resolve({ unconfigured: true });
      return new Promise(resolve => {
        if (!window.google?.accounts?.oauth2) return resolve({ error: 'Google sign-in could not load. Check your connection and try again.' });
        google.accounts.oauth2.initTokenClient({
          client_id: id,
          scope: 'openid profile email https://www.googleapis.com/auth/user.birthday.read',
          error_callback: () => resolve({ cancelled: true }),
          callback: async t => {
            if (t.error) return resolve({ error: 'Google sign-in was not completed.' });
            try {
              const r = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,birthdays',
                { headers: { Authorization: 'Bearer ' + t.access_token } });
              const p = await r.json();
              const b = (p.birthdays || []).map(x => x.date).find(d => d && d.year);
              let age = null;
              if (b) { const n = new Date(); age = n.getFullYear() - b.year - ((n.getMonth() + 1 < b.month || (n.getMonth() + 1 === b.month && n.getDate() < b.day)) ? 1 : 0); }
              resolve({ profile: { name: p.names?.[0]?.displayName || 'Friend', email: p.emailAddresses?.[0]?.value || '', photo: p.photos?.[0]?.url || '', age, provider: 'google' } });
            } catch { resolve({ error: 'Could not read your Google profile. Try again.' }); }
          }
        }).requestAccessToken();
      });
    },
    finishGoogle: profile => begin(profile)
  };
  window.Auth = Auth;
})();
