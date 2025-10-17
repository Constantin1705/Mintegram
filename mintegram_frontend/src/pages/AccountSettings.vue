<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">Temă globală</div>
        <div class="row items-center q-col-gutter-md q-mb-md">
          <div class="col-auto">
            <q-select v-model="theme" :options="themeOptions" label="Alege tema" outlined dense style="min-width:120px" />
          </div>
          <div class="col-auto">
            <q-btn color="primary" label="Salvează tema" @click="saveTheme" />
          </div>
        </div>
        <div class="text-h5">Setări cont</div>
      </q-card-section>
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
              <q-toggle v-model="darkMode" label="Dark mode" />
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
import { ref, onMounted } from 'vue';
import { useAuth } from 'stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';


const theme = ref('light');
const themeOptions = [ { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' } ];

function saveTheme() {
  axios.patch('/api/theme-setting/', { theme: theme.value })
    .then(res => {
      if (res.data && res.data.theme) {
        $q.notify({ type: 'positive', message: 'Tema a fost salvată!' });
        $q.dark.set(res.data.theme === 'dark');
      } else {
        $q.notify({ type: 'warning', message: 'Verifică răspunsul API.' });
      }
    })
    .catch(() => {
      $q.notify({ type: 'negative', message: 'Eroare la salvarea temei.' });
    });
}


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

onMounted(() => {
  if (auth.user) {
    username.value = auth.user.username || '';
    email.value = auth.user.email || '';
  }
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
