# mintegram (mintegram-frontend)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## Tema de Crăciun / Seasonal Themes

Aplicația suportă teme sezoniere ce se aplică peste modul light/dark.

- Toggle rapid Crăciun: buton lângă toggle de dark mode în header.
- Setare din pagina `Setări` prin selectul "Temă" (Crăciun / Paște / Implicită).
- Persistență: valoarea este salvată în `localStorage` sub cheia `mintegram_seasonal_theme`.
- Clase globale pe `<body>`: `theme-christmas`, `theme-easter` folosite pentru stiluri și efecte.
- Pentru a adăuga o nouă temă: definiți clase similare în `src/css/app.scss` și emiteți un `CustomEvent('mintegram-seasonal-change', { detail: 'nume_tema' })`.

Fișier relevant stiluri: `src/css/app.scss`.

## Pagina Dog Showcase

Ruta: `/dog-showcase` (publică) afișează un câine SVG animat care prezintă aplicația prin mesaje rotative.

Schimbare / înlocuire animație:
- Poți importa Lottie: creează `src/assets/dog.json` și înlocuiește SVG din `DogShowcase.vue` cu `<MascotLottie :src="dogJson" />`.
- Mesajele se află în array-ul `features` din script; adaugă sau modifică după nevoie.
- Bara de progres indică timpul până la următorul mesaj.

Optimizări sugerate viitoare:
- Adăugare sunet scurt (lătrat) la schimbarea mesajelor.
- Butoane de navigare manuală prin mesaje.
- Integrare cu badge-uri reale din backend.

