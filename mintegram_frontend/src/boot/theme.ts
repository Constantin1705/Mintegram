import { boot } from 'quasar/wrappers';
import axios from 'axios';

export default boot(({ app }) => {
  void axios.get('/api/theme-setting/')
    .then(res => {
      if (res.data && res.data.theme) {
        app.config.globalProperties.$q.dark.set(res.data.theme === 'dark');
      }
    });
});
