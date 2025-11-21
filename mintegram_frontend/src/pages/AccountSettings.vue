<template>
  <q-page class="q-pa-md">
    <q-card>
      <!-- <q-card-section>
        <div class="text-h6 q-mb-md">Temă globală</div>
        <div class="row items-center q-col-gutter-md q-mb-md">
          <div class="col-auto">
            <q-select v-model="theme" :options="themeOptions" label="Alege tema" outlined dense style="min-width:120px" />
          </div>
          <div class="col-auto">
            <q-btn color="primary" label="Salvează tema" @click="saveTheme" />
          </div>
        </div> -->
        <div class="text-h5">Setări cont</div>
      <!-- </q-card-section> -->
      <q-separator />
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>Schimbă limba</q-item-section>
            <q-item-section side>
              <q-select v-model="language" :options="languages" dense outlined style="min-width:120px" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Temă</q-item-section>
            <q-item-section side>
              <div class="row items-center q-gutter-sm">
                <q-toggle v-model="darkMode" label="Dark mode" />
                <q-select v-model="seasonalTheme" :options="seasonalOptions" dense outlined style="min-width:160px" />
                <q-btn color="primary" label="Aplică" @click="applySeasonalTheme" />
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Sunete joc</q-item-section>
            <q-item-section side>
              <q-toggle v-model="soundOn" label="Pornit" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Notificări</q-item-section>
            <q-item-section side>
              <q-toggle v-model="notifications" label="Active" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Dificultate implicită</q-item-section>
            <q-item-section side>
              <q-select v-model="difficulty" :options="difficulties" dense outlined style="min-width:120px" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-h6">Date personale</div>
        <q-input v-model="username" label="Username" outlined class="q-mb-sm" />
        <q-input v-model="email" label="Email" outlined class="q-mb-sm" />
        <q-btn color="primary" label="Salvează" @click="saveProfile" class="q-mr-sm" />
    <q-btn color="negative" label="Schimbă parola" flat @click="showPasswordDialog = true" />
      </q-card-section>
      <q-separator />
      <q-card-section>
  <q-btn color="negative" label="Șterge contul" @click="showDeleteDialog = true" flat />
    <!-- Dialog schimbare parolă -->
    <q-dialog v-model="showPasswordDialog">
      <q-card style="min-width:320px">
        <q-card-section>
          <div class="text-h6">Schimbă parola</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="newPassword" type="password" label="Parolă nouă" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Anulează" v-close-popup />
          <q-btn color="primary" label="Salvează" @click="changePassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog confirmare ștergere cont -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width:320px">
        <q-card-section>
          <div class="text-h6">Confirmă ștergerea contului</div>
          <div class="q-mt-sm">Această acțiune este ireversibilă!</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Anulează" v-close-popup />
          <q-btn color="negative" label="Șterge" @click="deleteAccount" />
        </q-card-actions>
      </q-card>
    </q-dialog>
        <q-btn color="grey" label="Logout" @click="logout" flat class="q-ml-sm" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuth } from 'stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';


// const theme = ref('light');
// const themeOptions = [ { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' } ];

// function saveTheme() {
//   axios.patch('/api/theme-setting/', { theme: theme.value })
//     .then(res => {
//       if (res.data && res.data.theme) {
//         $q.notify({ type: 'positive', message: 'Tema a fost salvată!' });
//         $q.dark.set(res.data.theme === 'dark');
//       } else {
//         $q.notify({ type: 'warning', message: 'Verifică răspunsul API.' });
//       }
//     })
//     .catch(() => {
//       $q.notify({ type: 'negative', message: 'Eroare la salvarea temei.' });
//     });
// }


const showPasswordDialog = ref(false);
const newPassword = ref('');
const showDeleteDialog = ref(false);

const $q = useQuasar();

function changePassword() {
  if (!newPassword.value || newPassword.value.length < 6) {
    $q.notify({ type: 'warning', message: 'Parola trebuie să aibă minim 6 caractere.' });
    return;
  }
  axios.post('/api/change-password/', { password: newPassword.value })
    .then((res) => {
      if (res.data && res.data.success) {
        $q.notify({ type: 'positive', message: 'Parola a fost schimbată!' });
        showPasswordDialog.value = false;
        newPassword.value = '';
      } else {
        $q.notify({ type: 'warning', message: res.data.message || 'Verifică parola.' });
      }
    })
    .catch((err) => {
      $q.notify({ type: 'negative', message: err.response?.data?.message || 'Eroare la schimbarea parolei.' });
    });
}

function deleteAccount() {
  axios.delete('/api/delete-account/')
    .then((res) => {
      if (res.data && res.data.success) {
        $q.notify({ type: 'positive', message: 'Contul a fost șters.' });
        showDeleteDialog.value = false;
        auth.logout();
  void router.push('/login');
      } else {
        $q.notify({ type: 'warning', message: res.data.message || 'Nu s-a putut șterge contul.' });
      }
    })
    .catch((err) => {
      $q.notify({ type: 'negative', message: err.response?.data?.message || 'Eroare la ștergerea contului.' });
    });
}
const language = ref('ro');
const languages = [ { label: 'Română', value: 'ro' }, { label: 'English', value: 'en' } ];
const darkMode = ref(false);
const soundOn = ref(true);
const notifications = ref(true);
const difficulty = ref('mediu');
const difficulties = [ { label: 'Ușor', value: 'usor' }, { label: 'Mediu', value: 'mediu' }, { label: 'Dificil', value: 'dificil' } ];
const auth = useAuth();
const router = useRouter();
const username = ref('');
const email = ref('');
const seasonalTheme = ref('')
const seasonalOptions = [
  { label: 'Implicită', value: '' },
  { label: 'Crăciun', value: 'christmas' },
  { label: 'Paște', value: 'easter' }
]

function applySeasonalTheme() {
  // normalize possible object returned by QSelect (could be { label, value })
  const raw = seasonalTheme.value as unknown
  let t = ''
  if (typeof raw === 'string') t = raw.trim()
  else if (raw && typeof raw === 'object') {
    // try common keys value/label if present
    // @ts-expect-error - runtime check below
    const maybeValue = raw.value ?? raw.label
    if (typeof maybeValue === 'string') t = maybeValue.trim()
    else if (typeof maybeValue === 'number') t = String(maybeValue)
  }
  // persist selection
  try {
    if (t === '') {
      localStorage.removeItem('mintegram_seasonal_theme')
    } else {
      localStorage.setItem('mintegram_seasonal_theme', t)
    }
  console.debug('[AccountSettings] persisted seasonal theme ->', t)
  } catch { console.debug('Could not persist seasonal theme') }
  // apply global body class
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.remove('theme-christmas', 'theme-easter')
    if (t === 'christmas') document.body.classList.add('theme-christmas')
    else if (t === 'easter') document.body.classList.add('theme-easter')
    // notify other parts of the app in this window
  }
  // always dispatch (so same-tab listeners get notified even if document.body check failed)
  try { window.dispatchEvent(new CustomEvent('mintegram-seasonal-change', { detail: t })) } catch (err) { console.debug('Could not dispatch seasonal-change event', err) }
  console.debug('[AccountSettings] dispatched mintegram-seasonal-change ->', t)
  // user feedback (friendly label)
  const display = t === 'christmas' ? 'Crăciun' : t === 'easter' ? 'Paște' : ''
  try { $q.notify({ type: 'positive', message: display ? `Tema sezonieră aplicată: ${display}` : 'Tema sezonieră resetată la implicită' }) } catch { console.debug('Could not show notification') }
}

onMounted(() => {
  if (auth.user) {
    username.value = auth.user.username || '';
    email.value = auth.user.email || '';
  }
  // initialize dark mode toggle from current Quasar state
  darkMode.value = $q.dark.isActive;
  // restore any seasonal theme
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
  const savedRaw = localStorage.getItem('mintegram_seasonal_theme') || ''
      // normalize: guard against objects or JSON accidentally stored
      const normalize = (v: unknown) => {
        if (v == null) return ''
        if (typeof v !== 'string') return ''
        const s = v.trim()
        if (!s) return ''
        if (s === '[object Object]') return ''
        if (s.startsWith('{') || s.startsWith('[')) return ''
        return s
      }
      const saved = normalize(savedRaw)
      console.debug('[AccountSettings] restored seasonal theme from storage ->', { savedRaw, saved })
      if (saved) {
        seasonalTheme.value = saved
        if (document && document.body) {
          const cls = saved === 'christmas' ? 'theme-christmas' : saved === 'easter' ? 'theme-easter' : ''
          if (cls) document.body.classList.add(cls)
        }
      } else {
        // cleanup bad stored value
        if (savedRaw && savedRaw !== '') {
          try { localStorage.removeItem('mintegram_seasonal_theme') } catch { console.debug('Could not remove invalid seasonal theme') }
        }
      }
    }
  } catch (err) { console.debug('Could not restore seasonal theme', err) }
});

// persist and propagate theme changes
watch(darkMode, (val) => {
  $q.dark.set(val);
  try {
    localStorage.setItem('theme', val ? 'dark' : 'light');
  } catch {/* ignore storage errors */}
  // best-effort backend update (optional)
  axios.patch('/api/theme-setting/', { theme: val ? 'dark' : 'light' })
    .catch(() => {/* ignore backend errors for UX smoothness */});
});

function saveProfile() {
  // Exemplu: update local store, poți adăuga API call
  if (auth.user) {
    auth.user.username = username.value;
    auth.user.email = email.value;
    // TODO: API call pentru update profil
  }
}
function logout() {
  auth.logout();
  void router.push('/login');
}
</script>

<style scoped>
.q-card {
  max-width: 500px;
  margin: 0 auto;
}
</style>
