import { boot } from 'quasar/wrappers';
import { Dark } from 'quasar';
import axios from 'axios';

export default boot(() => {
  // 1) Respect locally saved preference if available
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      Dark.set(saved === 'dark');
      return;
    }
  } catch {
    // ignore storage errors
  }

  // 2) Otherwise, ask backend; if missing, fall back to system preference
  void axios
    .get('/api/theme-setting/')
    .then((res) => {
      const pref = res?.data?.theme as 'dark' | 'light' | undefined;
      if (pref === 'dark' || pref === 'light') {
        Dark.set(pref === 'dark');
      } else {
        Dark.set('auto');
      }
    })
    .catch(() => {
      Dark.set('auto');
    });
});
